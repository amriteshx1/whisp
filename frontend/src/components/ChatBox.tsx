
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

      
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-10 text-gray-500 max-md:hidden">
      <img src={applogo} alt=""  className="h-[10vh]"/>
      <p className="text-lg font-medium text-zinc-600">Stay connected - softly, silently, seamlessly.</p>
    </div>
  )
}

export default ChatBox;
