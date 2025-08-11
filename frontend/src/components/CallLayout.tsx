import React, { useState } from "react";
import { useCall } from "../../context/CallContext";
import toast from "react-hot-toast";
import assets from "../assets/chat-app-assets/assets";
import videoCall from "../assets/videoCall.png";

const CallLayout: React.FC = () => {
  const {
    localStream,
    remoteStream,
    callActive,
    incomingCall,
    acceptCall,
    rejectCall,
    endCall,
  } = useCall();


  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  // toggle mute/unmute
  const toggleMute = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((t) => (t.enabled = muted ? true : false));
    setMuted((m) => !m);
    toast((muted ? "Unmuted" : "Muted"));
  };

  // toggle camera on/off
  const toggleCamera = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((t) => (t.enabled = cameraOff ? true : false));
    setCameraOff((c) => !c);
    toast((cameraOff ? "Camera enabled" : "Camera disabled"));
  };

  // end call
  const handleEnd = () => {
    endCall();
  };

  
return null;
};


export default CallLayout;
