import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { AuthContext } from "./AuthContext";
import type { Socket } from "socket.io-client";
import toast from "react-hot-toast";

interface CallContextType {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callActive: boolean;
  peerConnection: RefObject<RTCPeerConnection | null>;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  setCallActive: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoteUserId: React.Dispatch<React.SetStateAction<{ id: string } | null>>;
  remoteUserId: { id: string } | null;
  otherUserSocketId: RefObject<string | null>;
  endCall: () => void;
  incomingCall: null | { from: string; offer: any; isVideo: boolean };
  acceptCall: () => void;
  rejectCall: () => void;
}

const CallContext = createContext<CallContextType | null>(null);

export const useCall = (): CallContextType => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within CallProvider");
  }
  return context;
};


interface CallProviderProps {
  children: ReactNode;
}

export const CallProvider = ({ children }: CallProviderProps) => {
  const { socket } = useContext(AuthContext) as { socket: Socket | null };
  const {authUser} = useContext(AuthContext);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callActive, setCallActive] = useState(false);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const otherUserSocketId = useRef<string | null>(null);
  const [remoteUserId, setRemoteUserId] = useState<{ id: string } | null>(null);

  const [incomingCall, setIncomingCall] = useState<null | { from: string; offer: any; isVideo: boolean }>(null);

  //for ending the call
  const endCall = () => {
    if (socket && otherUserSocketId.current) {
      if (!remoteStream) {
        // caller hangs up before callee answers
        socket?.emit("cancel-call", { to: otherUserSocketId.current });
      } else {
        // normal end call
        socket.emit("call-ended", { to: otherUserSocketId.current });
      }
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((t) => t.stop());
      setRemoteStream(null);
    }
    setCallActive(false);
    setIncomingCall(null);
    setRemoteUserId(null);
    otherUserSocketId.current = null;
  };

  //for accepting call
  const acceptCall = async () => {
    if (!incomingCall) return;

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(
        incomingCall.isVideo ? { video: true, audio: true } : { audio: true }
      );
      setLocalStream(stream);
    } catch (err) {
      toast.error("Permission denied");
      endCall();
      setIncomingCall(null);
      return;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current = pc;
    otherUserSocketId.current = incomingCall.from;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", {
          to: incomingCall.from,
          from: authUser?._id,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    setRemoteUserId({ id: incomingCall.from });
    setCallActive(true);
    setIncomingCall(null);

    socket?.emit("answer-call", { to: incomingCall.from, from: authUser?._id, answer });
  };

  //for rejecting call
  const rejectCall = () => {
    if (incomingCall?.from) {
      socket?.emit("call-rejected", { to: incomingCall.from, from: authUser?._id });
    }
    setIncomingCall(null);
    endCall();
  };

  useEffect(()=>{
    if (!socket) return;

    // handle incoming call
    socket.on("incoming-call", async ({ from, offer, isVideo }) => {
      if (callActive) {
        socket.emit("call-rejected", { to: from });
      } else {
        setIncomingCall({ from, offer, isVideo });
      }
    });

  socket.on("call-answered", async ({ from: _from, answer }) => {
    if (peerConnection.current) {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    }
  });

  socket.on("ice-candidate", async ({to: _to, from: _from, candidate }) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    } catch (err) {
      console.error("Error adding ICE candidate:", err);
    }
  });

  socket.on("call-rejected", ({from: _from}) => {
    toast("Call rejected!");
    endCall();
  });

  socket.on("call-cancelled", () => {
    toast("Call missed!");
    endCall(); 
  });

  socket.on("call-ended", () => {
      toast("Call ended");
      endCall();
  });

  return () => {
    socket.off("incoming-call");
    socket.off("call-answered");
    socket.off("ice-candidate");
    socket.off("call-ended");
    socket.off("call-rejected");
    socket.off("call-cancelled");
  };

  }, [socket, endCall])

  return (
    <CallContext.Provider
      value={{
        localStream,
        remoteStream,
        callActive,
        peerConnection,
        remoteUserId,
        setRemoteUserId,
        setLocalStream,
        setRemoteStream,
        setCallActive,
        otherUserSocketId,
        endCall,
        incomingCall,
        acceptCall,
        rejectCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
