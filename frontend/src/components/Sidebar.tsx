
import { useNavigate } from "react-router-dom";
import applogo from "../assets/appLogo.jpg";
import menuIcon from "../assets/menuIcon.png";
import searchIcon from "../assets/searchIcon.png";
import assets from "../assets/chat-app-assets/assets";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";


const Sidebar = () => {

   const {getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages} = useContext(ChatContext);

   const { logout, onlineUsers } = useContext(AuthContext);

   const [input, setInput] = useState<string>("");

    const navigate = useNavigate();

    const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(()=>{
      getUsers();
    }, [onlineUsers])

  return (
    <div className={`h-full p-5 rounded-r-xl overflow-y-auto text-white/80 ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className="pb-5">
        <div className="flex justify-between items-center pl-[1vh]">
            <img src={applogo} alt="whispLogo" className="h-[5vh]" />
            <div className="relative py-2 group">
                <img src={menuIcon} alt="menu" className="max-h-6 cursor-pointer" />
                <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-neutral-900 text-white/80 hidden group-hover:block">
                    <p onClick={() => navigate('/friends')} className="cursor-pointer text-sm">Add Friends</p>
                    <hr className="my-2 border-t border-white/80" />
                    <p onClick={() => navigate('/profile')} className="cursor-pointer text-sm">Edit Profile</p>
                    <hr className="my-2 border-t border-white/80" />
                    <p onClick={() => logout()} className="cursor-pointer text-sm">Logout</p>
                </div>
            </div>
        </div>
    
        <div className="bg-neutral-900 rounded-full flex items-center gap-2 py-3 px-4 mt-5">
            <img src={searchIcon} alt="search" className="h-[2.2vh]" />
            <input onChange={(e)=>setInput(e.target.value)} type="text" className="bg-transparent border-none outline-none text-white/80 text-xs flex-1 placeholder-neutral-500" placeholder="Search User..." />
        </div>

      </div>

      <div className="flex flex-col gap-3">
        {filteredUsers.map((user, index) => (
          <div onClick={() => {setSelectedUser(user); setUnseenMessages(prev => ({...prev, [user._id] : 0}))}}
          key={index} className={`relative flex items-center gap-4 p-2 pl-4 rounded cursor-pointer max-sm:text-sm hover:bg-neutral-900/70 hover:rounded-xl ${selectedUser && selectedUser._id === user._id && 'bg-neutral-900/70 rounded-xl'}`}>
            <img src={user?.profilePic || assets.avatar_icon} alt={user.fullName} className="w-[40px] aspect-[1/1] rounded-full" />
            <div className="flex flex-col leading-5">
              <p className="text-sm font-medium text-white/80">{user.fullName}</p>
              {
                onlineUsers.includes(user._id)
                ? <span className="text-green-700 text-xs">Online</span>
                : <span className="text-neutral-500 text-xs">Offline</span>
              }
            </div>
            {unseenMessages[user._id] > 0 && <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full text-neutral-500 bg-white/80">
              {unseenMessages[user._id]}</p> }
          </div>
        ))}

      </div>
    </div>
  )
}

export default Sidebar;
