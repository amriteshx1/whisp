
import assets from "../assets/chat-app-assets/assets";
import applogo from "../assets/appLogo.jpg";
import { useContext, useEffect, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useCall } from "../../context/CallContext";
import audioCall from "../assets/audioCall.png";
import videoCall from "../assets/videoCall.png";

const ChatBox = () => {

  const { messages, selectedUser, showUserBox, setSelectedUser, setShowUserBox, sendMsg, getMsgs }  = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef<HTMLDivElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sendingImage, setSendingImage] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const typingTimerRef = useRef<number | null>(null);
  const [peerTyping, setPeerTyping] = useState(false);


  const {socket} = useContext(AuthContext);

  const { peerConnection, setLocalStream, setRemoteStream, setCallActive, otherUserSocketId, endCall } = useCall();

  const startCall = async (isVideo: boolean) => {

    if (!selectedUser) {
      toast("Please select a user to call.");
      return;
    }

    if (!onlineUsers.includes(selectedUser._id)) {
      toast("Can't place a call, user is offline");
      return;
    }

    const mediaConstraints = isVideo
      ? { video: true, audio: true }
      : { audio: true };
  
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      setLocalStream(stream);
    } catch (err) {
      toast("Call ended, permission denied");
      endCall();
      return;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current = pc;
    otherUserSocketId.current = selectedUser?._id ?? null;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", {
          to: selectedUser?._id,
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

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  console.log("Emitting call-user to", selectedUser?._id);
  socket?.emit("call-user", {
    to: selectedUser?._id,
    from: authUser?._id,
    offer,
    isVideo,
  });

  setCallActive(true);
};

const startVoiceCall = () => startCall(false);
const startVideoCall = () => startCall(true);

  //handle sending message
  const handleSendMessage = async (e: React.FormEvent)=> {
    e.preventDefault();
    if(input.trim() === "") return null;
    await sendMsg({text: input.trim()});
    setInput("");
    if (socket && selectedUser && authUser) {
      socket.emit("stop-typing", { to: selectedUser._id, from: authUser._id });
    }
  }

  //handle sending image
  const handleSendImage = async(e : React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file || !file.type.startsWith("image/")){
      toast("Select an image file");
      return;
    }

    setSendingImage(true);

    const reader = new FileReader();
    reader.onloadend = async ()=>{
      try {
        await sendMsg({ image: reader.result as string });
      } finally {
        setSendingImage(false);
        e.target.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
  
    if (!socket || !selectedUser || !authUser) return;
  
    // tell we’re typing
    socket.emit("typing", { to: selectedUser._id, from: authUser._id, isTyping: true });
  
    // debounce a stop-typing
    if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => {
      socket.emit("stop-typing", { to: selectedUser._id, from: authUser._id });
    }, 1200);
  };



  useEffect(()=>{
    if(selectedUser){
      setLoadingMsgs(true);
      getMsgs(selectedUser._id).finally(() => {
        setLoadingMsgs(false);
      });
    }
  }, [selectedUser])

  useEffect(() => {
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({behavior : "smooth"})
    }
  }, [messages])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
  
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    if (!socket) return;
  
    const handleTyping = (p: { from: string; to: string; isTyping?: boolean }) => {
      if (selectedUser && p.from === selectedUser._id) setPeerTyping(p.isTyping ?? true);
    };
    const handleStopTyping = (p: { from: string; to: string }) => {
      if (selectedUser && p.from === selectedUser._id) setPeerTyping(false);
    };
  
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);
    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    setPeerTyping(false);
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  }, [selectedUser]);

  

  return selectedUser && !showUserBox ? (
    <div className="h-full overflow-scroll relative">

      {/* upper navbar type stuff */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b-2 border-b-neutral-900">
        <img onClick={() => setSelectedUser(null)} src={assets.arrow} alt="back-arrow" className="lg:hidden w-5 h-5" />
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="profile-pic" className="w-8 h-8 rounded-full"/>
        <p className="flex-1 text-lg font-medium text-white/80 flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-600"></span>}
          {peerTyping && <span className="text-xs text-neutral-400 animate-pulse">(typing…)</span>}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="back-arrow" className="md:hidden max-w-7" />
        <img onClick={startVoiceCall} src={audioCall} className="w-8 p-1 cursor-pointer bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 rounded-lg hover:bg-neutral-800" alt="voice-call"/>
        <img onClick={startVideoCall} src={videoCall} className="w-8 p-1 cursor-pointer bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 rounded-lg hover:bg-neutral-800" alt="video-call" />
        
        <img onClick={() => setShowUserBox(prevShowUserBox => !prevShowUserBox)} src={assets.help_icon} alt="info" className="lg:hidden block max-w-6" />

      </div>

      {/* main chat arena */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        <p className="text-xs font-medium text-center text-neutral-500 flex justify-center items-center gap-1 mb-[2vh] mt-[1vh]"><img src={assets.lock} alt="locked" className="w-3 h-3" /> End-to-end encrypted</p>
        {loadingMsgs ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-7 h-7 border-3 border-gray-400 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
         messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser?._id 
            && 'flex-row-reverse' }`}>
              {msg.image ? (
                <img src={msg.image} alt="message-image" className="max-w-[230px] border border-neutral-900 rounded-lg overflow-hidden mb-8" />
              ) : (
                <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 text-white/80 ${msg.senderId
                  === authUser?._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
              )}

              <div className="text-center text-xs">
                <img src={msg.senderId === authUser?._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="profile-pic" 
                className="w-7 h-7 rounded-full"/>
                <p className="text-neutral-500">{formatMessageTime(msg.createdAt || "")}</p>
                  {msg.senderId === authUser?._id && msg.status === "delivered" && (
                    <img src={assets.delivered} alt="delivered" className="w-4 h-4 text-gray-500" />
                  )}
                  {msg.senderId === authUser?._id && msg.status === "seen" && (
                    <img src={assets.seen} alt="seen" className="w-4 h-4 text-blue-500" />
                  )}
              </div>
          </div>
        ))
      )}
        <div ref={scrollEnd}></div>
      </div>

      {/*  bottom stuffs */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-neutral-900 px-3 rounded-full relative">
          <button type="button" 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => {
              setShowEmojiPicker((prev) => !prev);
            }} 
            className={`p-2 rounded-full ${showEmojiPicker ? 'bg-neutral-800' : 'hover:bg-neutral-800'} cursor-pointer`}><img src={assets.smile} alt="emoji" className="h-5 w-5" /></button>
          {showEmojiPicker && (
            <div ref={pickerRef} className="absolute bottom-14 left-0 z-50">
              <Picker
                onEmojiSelect={(emoji: any) => {
                  setInput((prev) => prev + emoji.native);
                }}
                theme="dark"
              />
            </div>
          )}
          
          <input onChange={handleInputChange} value={input} onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder="Send a message"
          className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-neutral-400 placeholder-neutral-500" />
          <input onChange={handleSendImage} type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            {sendingImage ? (
              <div className="w-5 h-5 mr-2 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
            ) : (
              <img src={assets.gallery_icon} alt="send-image" className="w-5 mr-2 cursor-pointer"/>
            )}
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt="send-message" className="w-6 cursor-pointer" />
      </div>
    </div>
  ) : (
    <div className="lg:flex hidden flex-col items-center justify-center gap-5 text-gray-500 max-md:hidden">
      <img src={applogo} alt="whisp-logo"  className="h-[45vh]"/>
      <p className="text-lg font-medium text-neutral-500">Stay connected - softly, silently, seamlessly.</p>
    </div>
  )
}

export default ChatBox;
