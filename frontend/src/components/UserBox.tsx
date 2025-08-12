
import { useContext, useEffect, useState } from "react";
import assets from "../assets/chat-app-assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const UserBox = () => {

  const {selectedUser, messages, unfriend} = useContext(ChatContext);
  const {onlineUsers} = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState<string[]>([]);

  //get images from msg
  useEffect(()=>{
    setMsgImages(
      messages
        .map(msg => msg.image)
        .filter((url): url is string => typeof url === "string")
    )
  }, [messages])


  return selectedUser && (
    <div className={`text-white/80 w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}>

      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" 
        className="w-20 aspect-[1/1] rounded-full"/>
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) && <p className="w-2 h-2 rounded-full bg-green-500"></p>}
          {selectedUser.fullName}
        </h1>
        <p className="px-10 mx-auto text-xs">{selectedUser.bio}</p>
      </div>

      <hr className="w-[80%] mx-auto border border-neutral-900 my-4" />

      <div className="px-5 text-xs">
        <p>Media</p>
        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {msgImages.map((url, index) => (
            <div key={index} onClick={() => window.open(url)}
            className="cursor-pointer rounded">
              <img src={url} alt="" className="h-full rounded-md" />
            </div>
          ))}

        </div>
      </div>

      <button onClick={() => selectedUser && unfriend(selectedUser._id)} className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-tl from-neutral-950 via-red-500/20 to-red-600 text-white/75 border-none
      text-sm font-light py-2 px-20 rounded-full cursor-pointer hover:bg-red-950">
        Unfriend
      </button>
    </div>
  )
}

export default UserBox;
