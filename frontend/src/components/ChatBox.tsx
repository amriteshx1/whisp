
import assets from "../assets/chat-app-assets/assets";
import applogo from "../assets/appLogo.png";
import { useContext, useEffect, useRef, useState } from "react";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatBox = () => {

  const { messages, selectedUser, setSelectedUser, sendMsg, getMsgs }  = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef<HTMLDivElement | null>(null);

  const [input, setInput] = useState('');

  //handle sending message
  const handleSendMessage = async (e)=> {
    e.preventDefault();
    if(input.trim() === "") return null;
    await sendMsg({text: input.trim()});
    setInput("");
  }

  //handle sending image
  const handleSendImage = async(e) => {
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("Select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async ()=>{
      await sendMsg({image: reader.result});
      e.target.value = "";
    }
    reader.readAsDataURL(file);
  }

  useEffect(()=>{
    if(selectedUser){
      getMsgs(selectedUser._id);
    }
  }, [selectedUser])

  useEffect(() => {
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({behavior : "smooth"})
    }
  }, [messages])

  return selectedUser ? (
    <div className="h-full overflow-scroll relative">

      {/* upper navbar type stuff */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-gray-700">
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 rounded-full"/>
        <p className="flex-1 text-lg text-zinc-700 flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className="md:hidden max-w-7" />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />

      </div>

      {/* main chat arena */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id 
            && 'flex-row-reverse' }`}>
              {msg.image ? (
                <img src={msg.image} alt="" className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8" />
              ) : (
                <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-sky-600 text-white ${msg.senderId
                  === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
              )}

              <div className="text-center text-xs">
                <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" 
                className="w-7 rounded-full"/>
                <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
              </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/*  bottom stuffs */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-sky-200 px-3 rounded-full">
          <input onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder="Send a message"
          className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-neutral-600 placeholder-gray-400" />
          <input onChange={handleSendImage} type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer"/>
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt="" className="w-7 cursor-pointer" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-10 text-gray-500 max-md:hidden">
      <img src={applogo} alt=""  className="h-[10vh]"/>
      <p className="text-lg font-medium text-zinc-600">Stay connected - softly, silently, seamlessly.</p>
    </div>
  )
}

export default ChatBox;
