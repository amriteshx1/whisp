import { useEffect, useState } from "react";
import axios from "axios";
import assets from "../assets/chat-app-assets/assets";

interface User {
  _id: string;
  fullName: string;
  profilePic?: string;
  friendCode: string;
}

export default function FriendPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchCode, setSearchCode] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/messages/users");
      setUsers(res.data.users || []);
      console.log(res.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  return (
    <div className="p-4 text-black/80">
      <h1 className="text-xl font-semibold mb-4">Add Friends</h1>

      
    </div>
  );
}

