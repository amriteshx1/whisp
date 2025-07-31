import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";

const CallContext = createContext(null);

export const useCall = () => useContext(CallContext);

export const CallProvider = ({ children }) => {
  const { socket } = useContext(AuthContext);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const peerConnection = useRef(null);
  const otherUserSocketId = useRef(null);



  useEffect(()=>{
      if (!socket) return;
      console.log("Socket available in CallProvider");

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
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
