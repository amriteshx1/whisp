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
    } catch (err: any) {
      console.error("Error sending friend request:", err);
      alert(err.response?.data?.message || "Failed to send friend request.");
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

  // reject friend request
  const handleRejectRequest = async (requestId: string) => {
    try {
      await axios.post("/api/friends/respond", { requestId, action: "reject" });
      alert("Friend request rejected.");
      fetchPendingRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  return (
    <div className="p-4 bg-black h-screen overflow-auto text-white/80">
      <div className="flex flex-col justify-center items-center mt-[1vh] mb-[5vh] gap-2 p-2">
        <h1 className="text-3xl text-center font-semibold text-white/80">Friends</h1>
        <hr className="border-2 border-white/80 w-[15%]" />
      </div>

      {/* pending (incoming) requests */}
      <div className="mb-[10vh] flex flex-col justify-start items-center">
        <h2 className="text-xl font-medium mt-5 mb-2">Pending Requests</h2>
        {pendingRequests.length > 0 ? (
          <div className="space-y-3 flex flex-col justify-start items-center w-full">
            {pendingRequests.map((req) => (
              <div
                key={req._id}
                className="w-[30%] flex items-center justify-between p-2 rounded-xl bg-neutral-900"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={req.from.profilePic || assets.avatar_icon}
                    alt={req.from.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-white/80">{req.from.fullName}</p>
                    <p className="text-xs text-neutral-500">
                      Code: {req.from.friendCode}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(req._id)}
                    className="px-2 py-1 rounded-xl cursor-pointer"
                  >
                    <img src={assets.tick} alt="" className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleRejectRequest(req._id)}
                    className="px-2 py-1 rounded-xl cursor-pointer"
                  >
                    <img src={assets.cross} alt="" className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">No pending requests</p>
        )}
      </div>

      {/* search bar */}
      <form onSubmit={handleSearch} className="w-full flex gap-2 mb-5 mt-4 items-center justify-center">
        <input
          type="text"
          placeholder="Enter friend code..."
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="w-[35%] p-2 border border-neutral-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-600 text-neutral-400 placeholder-neutral-500"
        />
        <button
          type="submit"
          className="bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 text-white/75 hover:text-white/90 rounded-xl py-2 px-4 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* users list */}
      {loading ? (
        <p className="text-center text-white/80">Loading...</p>
      ) : users.length > 0 ? (
        <div className="space-y-3 flex flex-col justify-start items-center">
          {users.map((u) => {
            const alreadySent = outgoingIds.has(u._id);
            return (
              <div
                key={u._id}
                className="w-[50%] flex items-center justify-between p-2 rounded-xl bg-neutral-900"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.profilePic || assets.avatar_icon}
                    alt={u.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-white/80">{u.fullName}</p>
                    <p className="text-xs text-neutral-500">Code: {u.friendCode}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleSendRequest(u._id)}
                  disabled={alreadySent}
                  className={`px-2 py-1 rounded-xl transition ${
                    alreadySent
                      ? " cursor-not-allowed bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 opacity-50"
                      : " cursor-pointer bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700"
                  }`}
                >
                  {alreadySent ? <img src={assets.sentFriend} alt="" className="h-6 w-6" /> : <img src={assets.addFriend} alt="" className="h-6 w-6" />}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}

