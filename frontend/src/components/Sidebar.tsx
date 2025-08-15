
import { useNavigate } from "react-router-dom";
import applogo from "../assets/appLogo.jpg";
import menuIcon from "../assets/menuIcon.png";
import searchIcon from "../assets/searchIcon.png";
import assets from "../assets/chat-app-assets/assets";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";


const Sidebar = () => {

   const {friends, getFriends, getUsers, talkToBot, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages} = useContext(ChatContext);

   const { logout, onlineUsers } = useContext(AuthContext);

   const [input, setInput] = useState<string>("");

   const [loading, setLoading] = useState(true);
   const [botOpen, setBotOpen] = useState(false);
   const [botInput, setBotInput] = useState("");
   const [botLoading, setBotLoading] = useState(false);
   const [botMessages, setBotMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);

    const navigate = useNavigate();
    const chatEndRef = useRef<HTMLDivElement>(null);

    const filteredUsers = input ? friends.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : friends;

    useEffect(()=>{
      const fetchData = async () => {
        setLoading(true);
        try {
          await getUsers();
          await getFriends();
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [onlineUsers]);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [botMessages]);

    useEffect(() => {
      if (botOpen) {
        setTimeout(() => {
          chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
      }
    }, [botOpen]);

    const sendBotMessage = async () => {
      if (!botInput.trim()) return;

      const userMsg = { from: "user" as const, text: botInput };
      setBotMessages((prev) => [...prev, userMsg]);
      setBotInput("");
      setBotLoading(true);
      setBotMessages((prev) => [...prev, { from: "bot", text: "..." }]);

      try {
        const reply = await talkToBot(userMsg.text);
        setBotMessages((prev) => {
          const msgs = [...prev];
          msgs[msgs.length - 1] = { from: "bot", text: reply || "No reply" }; // replace skeleton with real reply
          return msgs;
        });
      } catch {
        setBotMessages((prev) => {
          const msgs = [...prev];
          msgs[msgs.length - 1] = { from: "bot", text: "⚠️ Bot is unavailable" };
          return msgs;
        });
      } finally {
        setBotLoading(false);
      }
    };

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
        {loading
          ? Array(5)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-2 pl-4 rounded-xl animate-pulse bg-neutral-900/40"
                >
                  <div className="w-[40px] h-[40px] bg-neutral-700 rounded-full flex items-center justify-center text-lg">
                    👤
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="w-3/5 h-3 bg-neutral-700 rounded"></div>
                    <div className="w-2/5 h-2 bg-neutral-800 rounded"></div>
                  </div>
                </div>
              ))
        : filteredUsers.map((user, index) => (
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
            {unseenMessages[user._id] > 0 && <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 text-white/75">
              {unseenMessages[user._id]}</p> }
          </div>
        ))}

      </div>

    </div>
  )
}

export default Sidebar;
