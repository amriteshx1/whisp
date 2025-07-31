import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { AuthContext } from "./AuthContext";
import type { Socket } from "socket.io-client";

interface CallContextType {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callActive: boolean;
  peerConnection: RefObject<RTCPeerConnection | null>;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  setCallActive: React.Dispatch<React.SetStateAction<boolean>>;
  otherUserSocketId: RefObject<string | null>;
  endCall: () => void;
}

const CallContext = createContext<CallContextType | null>(null);

export const useCall = () => useContext(CallContext);

interface CallProviderProps {
  children: ReactNode;
}

export const CallProvider = ({ children }: CallProviderProps) => {
  const { socket } = useContext(AuthContext) as { socket: Socket | null };

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callActive, setCallActive] = useState(false);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const otherUserSocketId = useRef<string | null>(null);

  //for ending the call
  const endCall = () => {
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
    otherUserSocketId.current = null;
  };

  useEffect(()=>{
      if (!socket) return;
      console.log("Socket available in CallProvider");

      // handle incoming call
      socket.on("incoming-call", async ({ from, offer, isVideo }) => {
      console.log("Incoming call from", from);

      const accept = window.confirm(`${from} is calling you. Accept?`);
      if (!accept) return;



    const stream = await navigator.mediaDevices.getUserMedia(
      isVideo ? { video: true, audio: true } : { audio: true }
    );
    setLocalStream(stream);
  
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
  
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });
  
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };
  
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: from,
          candidate: event.candidate,
        });
      }
  };

  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  peerConnection.current = pc;
  otherUserSocketId.current = from;
  setCallActive(true);

  socket.emit("answer-call", { to: from, answer });
  });

  socket.on("call-answered", async ({ from, answer }) => {
    console.log("Call answered by", from);
    if (peerConnection.current) {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    }
  });

  socket.on("ice-candidate", async ({ from, candidate }) => {
    console.log("Received ICE candidate from", from);
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

  socket.on("call-ended", () => {
      console.log("Call ended by other user.");
      endCall();
  });

  return () => {
    socket.off("incoming-call");
    socket.off("call-answered");
    socket.off("ice-candidate");
    socket.off("call-ended");
  };

  }, [socket])

  return (
    <CallContext.Provider
      value={{
        localStream,
        remoteStream,
        callActive,
        peerConnection,
        setLocalStream,
        setRemoteStream,
        setCallActive,
        otherUserSocketId,
        endCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
