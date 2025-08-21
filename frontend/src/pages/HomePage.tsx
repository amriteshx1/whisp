
import { useContext } from "react";
import ChatBox from "../components/ChatBox";
import Sidebar from "../components/Sidebar";
import UserBox from "../components/UserBox";
import { ChatContext } from "../../context/ChatContext";
import CallLayout from "../components/CallLayout";

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext);

  return (
    <div className="h-screen w-full relative bg-[radial-gradient(ellipse_at_bottom_left,#022c22,#000000,#000000)] bg-cover overflow-auto lg:px-[5vh] lg:py-[5vh] md:px-[3vh] md:py-[3vh] px-[1vh] py-[1vh]">
        <CallLayout />
            <div className={`h-full grid grid-cols-1 relative ${selectedUser ? 'lg:grid-cols-[1.3fr_2.5fr_1fr] grid-cols-1' : 'lg:grid-cols-2 grid-cols-1' }`}>
                <Sidebar />
                <ChatBox />
                <UserBox />

            </div>
    
      </div>
  )
}

export default HomePage;
