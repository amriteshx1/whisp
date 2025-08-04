
import { useContext } from "react";
import ChatBox from "../components/ChatBox";
import Sidebar from "../components/Sidebar";
import UserBox from "../components/UserBox";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext);

  return (
    <div className="min-h-screen w-full relative bg-black overflow-auto">
        <div
          className="absolute inset-0 z-0 h-full w-full px-[5vh] py-[5vh]"
        >
            <div className={`h-full grid grid-cols-1 relative ${selectedUser ? 'grid-cols-[1.3fr_2.5fr_1fr]' : 'grid-cols-2' }`}>
                <Sidebar />
                <ChatBox />
                <UserBox />

            </div>
    
      </div>
    </div>
  )
}

export default HomePage;
