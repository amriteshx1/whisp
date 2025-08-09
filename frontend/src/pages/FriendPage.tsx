import { useEffect, useState } from "react";
import axios from "axios";
import assets from "../assets/chat-app-assets/assets";

interface User {
  _id: string;
  fullName: string;
  profilePic?: string;
  friendCode: string;
}

interface FriendRequest {
  _id: string;
  from: User;
}

export default function FriendPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [outgoingIds, setOutgoingIds] = useState<Set<string>>(new Set());
  const [searchCode, setSearchCode] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/messages/nonFriends");
      setUsers(res.data.users || []);
      console.log(res.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // fetch incoming + outgoing pending requests
  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get("/api/friends/requests");
      const data = res.data || {};
      
      const incoming = data.incoming || [];
      const outgoing = data.outgoing || [];

      
      const mappedIncoming: FriendRequest[] = incoming.map((r: any) => ({
        _id: String(r._id),
        from: r.senderId,
      }));

      const outgoingSet = new Set<string>(
        outgoing.map((r: any) => String(r.receiverId?._id ?? r.receiverId))
      );

      setPendingRequests(mappedIncoming);
      setOutgoingIds(outgoingSet);
    } catch (err) {
      console.error("error fetching pending requests:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPendingRequests();
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
      console.error("Error searching user:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Send friend request
  const handleSendRequest = async (userIdOrCode: string) => {
  
    if (outgoingIds.has(userIdOrCode)) {
      alert("Friend request already sent.");
      return;
    }

    try {
      await axios.post(
        "/api/friends/request",
        { to: userIdOrCode }
      );
      
      setOutgoingIds((prev) => {
        const n = new Set(prev);
        n.add(userIdOrCode);
        return n;
      });

      alert("Friend request sent!");
    } catch (err) {
      console.error("Error sending friend request:", err);
      alert("Failed to send friend request.");
    }
  };

  // accept friend request
  const handleAcceptRequest = async (requestId: string) => {
    try {
      await axios.post("/api/friends/respond", { requestId, action: "accept" });
      alert("Friend request accepted!");
      
      fetchPendingRequests();
      fetchUsers();
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  

  return (
    <div className="p-4 bg-black h-screen overflow-auto text-white/80">
      <div className="flex flex-col justify-center items-center mt-[1vh] mb-[5vh] gap-2 p-2">
        <h1 className="text-3xl text-center font-semibold text-white/80">Friends</h1>
        <hr className="border-2 border-white/80 w-[15%]" />
      </div>

      
    </div>
  );
}

