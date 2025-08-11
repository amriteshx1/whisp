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

  if (incomingCall && !callActive) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-neutral-900 p-5 rounded-xl text-white flex flex-col gap-4 items-center">
        <p className="text-lg font-semibold">Incoming Call</p>
        <p className="text-sm text-gray-400">User {incomingCall.from} is calling…</p>
        <div className="flex gap-4 mt-4">
          <button onClick={rejectCall} className="bg-gradient-to-tl from-neutral-950 via-red-500/50 to-red-600 px-4 py-2 rounded-full cursor-pointer hover:bg-red-950"><img src={assets.reject} alt="" className="h-5 w-5" /></button>
          <button onClick={acceptCall} className="bg-gradient-to-tl from-neutral-950 via-green-400/20 to-green-500 px-4 py-2 rounded-full cursor-pointer hover:bg-green-950"><img src={assets.accept} alt="" className="h-5 w-5" /></button>
        </div>
      </div>
    </div>
  );
}


return null;
};


export default CallLayout;
