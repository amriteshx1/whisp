
import { useState } from "react";
import ChatBox from "../components/ChatBox";
import Sidebar from "../components/Sidebar";
import UserBox from "../components/UserBox";

const HomePage = () => {

    const [selectedUser, setSelectedUser] = useState(false);



  return (
    <div className="min-h-screen w-full relative overflow-auto">
        <div
          className="absolute inset-0 z-0 h-full w-full px-[15vh] py-[5vh]"
          style={{
            background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #90caff 100%)",
          }}
        >
            <div className={`h-full grid grid-cols-1 relative ${selectedUser ? 'grid-cols-[1fr_2fr_1fr]' : 'grid-cols-2' }`}>
                <Sidebar />
                <ChatBox />
                <UserBox />

            </div>
    
      </div>
    </div>
  )
}

export default HomePage;
