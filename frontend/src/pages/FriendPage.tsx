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

  // search by friend code
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "/api/friends/search",
        { code: searchCode }
      );
      if (res.data?.user) {
        setUsers([res.data.user]);
        console.log(res.data.user);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("error searching user:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Send friend request
  const handleSendRequest = async (userIdOrCode: string) => {
    try {
      await axios.post(
        "/api/friends/request",
        { to: userIdOrCode }
      );
      alert("Friend request sent!");
    } catch (err) {
      console.error("Error sending friend request:", err);
      alert("Failed to send friend request.");
    }
  };

  return (
    <div className="p-4 text-white/80">
      <h1 className="text-xl font-semibold mb-4 text-black/80">Add Friends</h1>

      
    </div>
  );
}

