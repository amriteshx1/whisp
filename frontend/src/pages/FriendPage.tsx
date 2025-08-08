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

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter friend code..."
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="flex-1 p-2 rounded-md bg-neutral-800 text-white outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>

      {/* Users list */}
      {loading ? (
        <p>Loading...</p>
      ) : users.length > 0 ? (
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between p-3 rounded-md bg-neutral-800"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.profilePic || assets.avatar_icon}
                  alt={u.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{u.fullName}</p>
                  <p className="text-xs text-gray-400">
                    Code: {u.friendCode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSendRequest(u._id)}
                className="px-3 py-1 bg-green-500 rounded hover:bg-green-600 transition"
              >
                Add Friend
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}

