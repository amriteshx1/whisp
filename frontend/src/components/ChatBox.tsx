
import type { User } from "../assets/chat-app-assets/assets";
import assets, { messagesDummyData } from "../assets/chat-app-assets/assets";
import applogo from "../assets/appLogo.png";
import { useEffect, useRef } from "react";
import { formatMessageTime } from "../lib/utils";

type ChatBoxProps = {
  selectedUser: User | false;
  setSelectedUser: (val: User | null) => void;
};

const ChatBox = ({selectedUser, setSelectedUser}: ChatBoxProps) => {

  const scrollEnd = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(scrollEnd.current){
      scrollEnd.current.scrollIntoView({behavior : "smooth"})
    }

  }, [])

  return selectedUser ? (
    <div className="h-full overflow-scroll relative">

      {/* upper navbar type stuff */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-gray-700">
        <img src={assets.profile_martin} alt="" className="w-8 rounded-full"/>
        <p className="flex-1 text-lg text-zinc-700 flex items-center gap-2">
          Martin Johnson
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className="md:hidden max-w-7" />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />

      </div>

      {/* main chat arena */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messagesDummyData.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== '680f50e4f10f3cd28382ecf9' 
            && 'flex-row-reverse' }`}>
              {msg.image ? (
                <img src={msg.image} alt="" className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8" />
              ) : (
                <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-sky-600 text-white ${msg.senderId
                  === '680f50e4f10f3cd28382ecf9' ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
              )}

              <div className="text-center text-xs">
                <img src={msg.senderId === '680f50e4f10f3cd28382ecf9' ? assets.avatar_icon : assets.profile_martin} alt="" 
                className="w-7 rounded-full"/>
                <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
              </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
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
