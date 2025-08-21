import React, { useState, useEffect, useContext } from "react";
import { useCall } from "../../context/CallContext";
import toast from "react-hot-toast";
import assets from "../assets/chat-app-assets/assets";
import videoCall from "../assets/videoCall.png";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const CallLayout: React.FC = () => {
  const {
    localStream,
    remoteStream,
    callActive,
    incomingCall,
    remoteUserId,
    acceptCall,
    rejectCall,
    endCall,
  } = useCall();

  const {selectedUser, friends} = useContext(ChatContext);
  const {authUser} = useContext(AuthContext);

  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  const [callingSound, setCallingSound] = useState<HTMLAudioElement | null>(null);
  const [incomingSound, setIncomingSound] = useState<HTMLAudioElement | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  const getCaller = (id: string) => {
    return friends.find(f => f._id === id) || null;
  };

  const isAudioOnly =
    ((localStream?.getVideoTracks()?.length ?? 0) === 0) &&
    ((remoteStream?.getVideoTracks()?.length ?? 0) === 0);

  useEffect(() => {
    const callerAudio = new Audio("/sounds/callerSide.mp3");
    callerAudio.loop = true;
    setCallingSound(callerAudio);    
    const incomingAudio = new Audio("/sounds/receiverSide.mp3");
    incomingAudio.loop = true;
    setIncomingSound(incomingAudio);

    //to stop audio on unmount
    return () => {
      callerAudio.pause();
      incomingAudio.pause();
    };
  }, []);

  useEffect(() => {
    if (!callingSound || !incomingSound) {
      return;
    }

    // you are the caller and the call is active but not connected yet
    if (callActive && !remoteStream) {
      incomingSound.pause();
      callingSound.play().catch(e => console.error("Error playing calling sound:", e));
    } 
    // you are the receiver and there is an incoming call
    else if (incomingCall) {
      callingSound.pause();
      incomingSound.play().catch(e => console.error("Error playing ringtone:", e));
    } 
    
    else {
      callingSound.pause();
      incomingSound.pause();
    }
  }, [callActive, remoteStream, incomingCall, callingSound, incomingSound]);

  useEffect(() => {
    if (callActive && !remoteStream) {
      const timer = setTimeout(() => {
        toast("Call ended, the recipient didn't answer.");
        endCall();
      }, 20000);
  
      return () => clearTimeout(timer);
    }
  }, [callActive, remoteStream, endCall]);

  useEffect(() => {
    let interval = null;
    if (remoteStream) {
      setCallDuration(0);
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [remoteStream]);

  // format mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

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
    const caller = getCaller(incomingCall.from);
    const callType = incomingCall.isVideo ? "Video Call" : "Audio Call";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="lg:w-[30vw] w-[45vw] bg-black bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 p-5 rounded-xl text-white flex flex-col gap-3 items-center">
        <p className="text-sm font-medium text-neutral-300 animate-pulse">Incoming {callType}</p>
        <p className="text-2xl text-neutral-200 font-medium">{caller?.fullName || "Unknown"}</p>
        <img src={caller?.profilePic || assets.avatar_icon} alt="caller-profile pic" className="h-24 w-24 rounded-full m-[5vh] animate-pulse" />
        <div className="flex lg:gap-[10vh] gap-[5vh] mt-4">
          <button onClick={rejectCall} className="bg-gradient-to-tl from-neutral-950 via-red-500/50 to-red-600 px-4 py-2 rounded-full cursor-pointer hover:bg-red-950"><img src={assets.reject} alt="reject" className="h-5 w-5" /></button>
          <button onClick={acceptCall} className="bg-gradient-to-tl from-neutral-950 via-green-400/20 to-green-500 px-4 py-2 rounded-full cursor-pointer hover:bg-green-950 animate-bounce"><img src={assets.accept} alt="accept" className="h-5 w-5" /></button>
        </div>
      </div>
    </div>
  );
}

if (callActive) {
  const activeUser = remoteUserId ? getCaller(remoteUserId.id) : selectedUser;
  const showAudioAvatars = callActive && isAudioOnly;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* intentionally did this to block interaction with the app */}
      <div className="absolute inset-0 bg-black/60" />

      {/* centered call window */}
      <div className="relative z-50 lg:w-[50vw] w-[70vw] max-w-[90%] bg-black bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 rounded-xl shadow-lg p-4 flex flex-col items-center">
        <p className="text-2xl font-medium text-neutral-200 mb-1">{activeUser?.fullName}</p>
        {/* Top area: ringing or status */}
        <div className="w-full mb-3 text-center">
          {!remoteStream ? (
            <div className="text-sm font-medium text-neutral-300 animate-pulse">Ringing…</div>
          ) : (
            <div className="text-sm font-medium text-neutral-300 animate-pulse">{formatTime(callDuration)}</div>
          )}
        </div>

        {/* video area */}
        <div className="w-full h-[40vh] flex gap-3">
          <div className="flex-1 bg-black rounded-lg overflow-hidden flex items-center justify-center relative">
            {/* Remote video - main */}
            <video
              ref={(el) => { if (el) el.srcObject = remoteStream;}}
              autoPlay
              playsInline
              className="w-full h-full object-cover bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700"
            />
            {/* If remote not available, show placeholder */}
            {!remoteStream && (
              <div className="absolute text-neutral-400"><img src={activeUser?.profilePic || assets.avatar_icon} alt="remoteUser profilePic" className="w-[80px] h-[80px] aspect-[1/1] rounded-full p-1 animate-pulse" /></div>
            )}

            {showAudioAvatars && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <img
                  src={activeUser?.profilePic || assets.avatar_icon}
                  alt="remote avatar"
                  className="w-[80px] h-[80px] aspect-[1/1] rounded-full p-1 animate-pulse"
                />
              </div>
            )}
          </div>

          {/* local preview */}
          <div className="w-[30%] h-[60%] overflow-hidden relative">
            <video
              ref={(el) => { if (el) el.srcObject = localStream;}}
              autoPlay
              muted
              playsInline
              className="w-full h-[85%] object-cover bg-gradient-to-tl from-neutral-950 via-green-400/20 to-green-700 rounded-lg"
            />
            <p className="text-sm font-medium text-neutral-400 text-center mt-[1vh]">You</p>
            {!localStream && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No camera
              </div>
            )}

            {showAudioAvatars && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <img
                  src={authUser?.profilePic || assets.avatar_icon}
                  alt="your avatar"
                  className="w-[50px] h-[50px] rounded-full p-1 animate-pulse"
                />
              </div>
            )}
          </div>
        </div>

        {/* controls */}
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={toggleMute}
            className={`px-3 py-2 rounded-full ${muted ? "bg-neutral-700" : "bg-neutral-800"} text-white cursor-pointer`}
            aria-label="Toggle mute"
          >
            {muted ? <img src={assets.mute} alt="un-mute" className="h-5 w-5" /> : <img src={assets.unmute} alt="mute" className="h-5 w-5" />}
          </button>

          <button
            onClick={toggleCamera} disabled={isAudioOnly} title={isAudioOnly ? "Camera not available in audio calls" : "Toggle camera"} 
            className={`px-3 py-2 rounded-full ${cameraOff ? "bg-neutral-700" : "bg-neutral-800"} text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-70`}
            aria-label="Toggle camera"
          >
            {cameraOff ? <img src={assets.noVideo} alt="video" className="h-5 w-5" /> : <img src={videoCall} alt="no-video" className="h-5 w-5" />}
          </button>

          <button
            onClick={handleEnd}
            className="px-4 py-2 rounded-full bg-gradient-to-tl from-neutral-950 via-red-500/50 to-red-600 cursor-pointer hover:bg-red-950 text-white"
            aria-label="End call"
          >
            <img src={assets.endCall} alt="end-call" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
return null;
};


export default CallLayout;
