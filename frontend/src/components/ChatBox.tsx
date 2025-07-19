
import type { User } from "../assets/chat-app-assets/assets";

type SidebarProps = {
  selectedUser: User | false;
  setSelectedUser: (val: User | false) => void;
};

const ChatBox = ({selectedUser, setSelectedUser}: SidebarProps) => {
  return (
    <div>
      <h1>Chatbox</h1>
    </div>
  )
}

export default ChatBox;
