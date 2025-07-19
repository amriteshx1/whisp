
import type { User } from "../assets/chat-app-assets/assets";

type SidebarProps = {
  selectedUser: User | false;
  setSelectedUser: (val: User | false) => void;
};

const UserBox = ({selectedUser, setSelectedUser}: SidebarProps) => {
  return (
    <div>
      <h1>Userbox</h1>
    </div>
  )
}

export default UserBox;
