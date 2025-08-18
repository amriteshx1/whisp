import { useEffect, useState } from "react";
import axios from "axios";
import assets from "../assets/chat-app-assets/assets";
import toast from "react-hot-toast";

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
  const [loadingPendingRequests, setLoadingPendingRequests] = useState(false);
  const [requestProcessing, setRequestProcessing] = useState<{
    send: boolean;
    accept: Record<string, boolean>;
    reject: Record<string, boolean>;
  }>({
    send: false,
    accept: {},
    reject: {},
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/messages/nonFriends");
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error("Error fetching users:");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // fetch incoming + outgoing pending requests
  const fetchPendingRequests = async () => {
    try {
      setLoadingPendingRequests(true);
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
      toast.error("error fetching pending requests:");
      console.log(err);
    }finally {
      setLoadingPendingRequests(false); 
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
      } else {
        setUsers([]);
      }
    } catch (err) {
      toast.error("Error searching user:");
      console.log(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Send friend request
  const handleSendRequest = async (userIdOrCode: string) => {
  
    if (outgoingIds.has(userIdOrCode)|| requestProcessing.send) {
      toast("Friend request already sent.");
      return;
    }

    setRequestProcessing((prev) => ({ ...prev, send: true }));

    toast.promise(
      axios.post("/api/friends/request", { to: userIdOrCode }),
      {
        loading: 'Sending friend request...',
        success: () => {
          setOutgoingIds((prev) => {
            const n = new Set(prev);
            n.add(userIdOrCode);
            return n;
          });
          setRequestProcessing((prev) => ({ ...prev, send: false }));
          return "Friend request sent!";
        },
        error: (err: any) => {
          setRequestProcessing((prev) => ({ ...prev, send: false }));
          return (
            err.response?.data?.message || "Failed to send friend request."
          );
        },
      }
    );
  };

  // accept friend request
  const handleAcceptRequest = async (requestId: string) => {
    if (requestProcessing.accept[requestId]) {
      return;
    }

    setRequestProcessing((prev) => ({
      ...prev,
      accept: { ...prev.accept, [requestId]: true },
    }));

    toast.promise(
      axios.post("/api/friends/respond", { requestId, action: "accept" }),
      {
        loading: 'Accepting request...',
        success: () => {
          fetchPendingRequests();
          fetchUsers();
          setRequestProcessing((prev) => {
            const newAccept = { ...prev.accept };
            delete newAccept[requestId];
            return { ...prev, accept: newAccept };
          });
          return "Friend request accepted!";
        },
        error: () => {
          setRequestProcessing((prev) => {
            const newAccept = { ...prev.accept };
            delete newAccept[requestId];
            return { ...prev, accept: newAccept };
          });
          return "Error accepting request.";
        },
      }
    );
  };

  // reject friend request
  const handleRejectRequest = async (requestId: string) => {
    if (requestProcessing.reject[requestId]) {
      return;
    }

    setRequestProcessing((prev) => ({
      ...prev,
      reject: { ...prev.reject, [requestId]: true },
    }));

    toast.promise(
      axios.post("/api/friends/respond", { requestId, action: "reject" }),
      {
        loading: 'Rejecting request...',
        success: () => {
          fetchPendingRequests();
          setRequestProcessing((prev) => {
            const newReject = { ...prev.reject };
            delete newReject[requestId];
            return { ...prev, reject: newReject };
          });
          return "Friend request rejected.";
        },
        error: () => {
          setRequestProcessing((prev) => {
            const newReject = { ...prev.reject };
            delete newReject[requestId];
            return { ...prev, reject: newReject };
          });
          return "Error rejecting request.";
        },
      }
    );
  };

  return (
    <div className="p-4 bg-[radial-gradient(ellipse_at_bottom_left,#022c22,#000000,#000000)] bg-cover h-screen overflow-auto text-white/80">
      <div className="flex flex-col justify-center items-center mt-[1vh] mb-[5vh] gap-2 p-2">
        <h1 className="text-3xl text-center font-semibold text-white/80">Friends</h1>
        <hr className="border-2 border-white/80 w-[15%]" />
      </div>

      {/* pending (incoming) requests */}
      <div className="mb-[10vh] flex flex-col justify-start items-center">
        <h2 className="text-xl font-medium mt-5 mb-2">Pending Requests</h2>

        {loadingPendingRequests ? (
          <div className="flex w-full justify-center items-center mt-[5vh]">
            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          </div>
        ) :
        pendingRequests.length > 0 ? (
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
                    disabled={requestProcessing.accept[req._id] || requestProcessing.reject[req._id]}
                    className="px-2 py-1 rounded-xl cursor-pointer hover:bg-neutral-800 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <img src={assets.tick} alt="accept" className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleRejectRequest(req._id)}
                    disabled={requestProcessing.accept[req._id] || requestProcessing.reject[req._id]}
                    className="px-2 py-1 rounded-xl cursor-pointer hover:bg-neutral-800 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <img src={assets.cross} alt="reject" className="h-6 w-6" />
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
        <div className="flex w-full justify-center items-center mt-[10vh]">
          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
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
                  disabled={alreadySent || requestProcessing.send}
                  className={`px-2 py-1 rounded-xl transition ${
                    alreadySent || requestProcessing.send
                      ? " cursor-not-allowed bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 opacity-50"
                      : " cursor-pointer bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 hover:bg-neutral-700"
                  }`}
                >
                  {alreadySent || requestProcessing.send ? <img src={assets.sentFriend} alt="request sent" className="h-6 w-6" /> : <img src={assets.addFriend} alt="add friend" className="h-6 w-6" />}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-sm text-white/80 mt-[10vh]">No users found</p>
      )}
    </div>
  );
}

