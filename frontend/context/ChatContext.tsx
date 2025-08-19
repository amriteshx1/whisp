import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  seen: boolean;
  status: "delivered" | "seen" | undefined;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatUser {
  _id: string;
  fullName: string;
  profilePic?: string;
  email?: string;
  bio?: string;
}

interface ChatContextType {
  messages: Message[];
  users: ChatUser[];
  friends: ChatUser[];
  selectedUser: ChatUser | null;
  getUsers: () => Promise<void>;
  getFriends: () => Promise<void>;
  unfriend: (friendId: string) => Promise<void>;
  getMsgs: (userId: string) => Promise<void>;
  sendMsg: (messageData: { text?: string; image?: string }) => Promise<void>;
  talkToBot: (prompt: string) => Promise<string>;
  setSelectedUser: (user: ChatUser | null) => void;
  unseenMessages: Record<string, number>;
  setUnseenMessages: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  showUserBox: boolean;
  setShowUserBox: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatContext = createContext<ChatContextType>({} as ChatContextType);;

export const ChatProvider = ({ children }: ChatProviderProps) => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [friends, setFriends] = useState<ChatUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [unseenMessages, setUnseenMessages] = useState<Record<string, number>>({});
    const [showUserBox, setShowUserBox] = useState(false);

    const {socket, axios} = useContext(AuthContext);

    //get all users
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error:any) {
            toast.error(error.message);
        }
    }

    //get all friends
    const getFriends = async () => {
        try {
          const {data} = await axios.get('api/friends');
          if(data?.friends){
            setFriends(data.friends);
          }
        } catch (error: any) {
          console.error("Error fetching friends:", error.message);
        }
    };

    //unfriend
    const unfriend = async (friendId: string) => {
      if (!confirm("Are you sure you want to remove this friend?")) return;
    
      try {
        const { data } = await axios.delete(`/api/friends/${friendId}`);
        toast.success(data.message || "Friend removed successfully");

        await getFriends();
        setSelectedUser(null);
      } catch (err) {
        toast.error("Error Unfriending");
        console.log(err);
      }
    };

    //get msgs for selected user
    const getMsgs = async(userId: string) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);

                setUnseenMessages((prevUnseenMessages) => {
                const newUnseenMessages = { ...prevUnseenMessages };
                delete newUnseenMessages[userId];
                return newUnseenMessages;
            });
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    //send msg to selected user
    const sendMsg = async (messageData: { text?: string; image?: string })=>{
        try {
            if (!selectedUser) return;
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage]);
            }else{
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    //subscribe to msgs for selected user
    const subscribeToMessages = async () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=>[...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages) =>({
                    ...prevUnseenMessages, [newMessage.senderId] :
                    (prevUnseenMessages[newMessage.senderId] || 0) + 1,
                }));
            }
        });

        // handle real-time status updates (delivered, seen)
        socket.on("messageStatusUpdate", ({ id, status }) => {
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg._id === id ? { ...msg, status, seen: status === "seen" } : msg
                )
            );
        });

        // handle bulk status updates for multiple messages
        socket.on("messageStatusUpdateBulk", ({ ids, status }) => {
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    ids.includes(msg._id) ? { ...msg, status, seen: status === "seen" } : msg
                )
            );
        });
    }

    //unsubscribe from msgs
    const unsubscribeFromMessages = ()=>{
        if(socket) socket.off("newMessage");
    }

    //chat-bot
    const talkToBot = async(prompt: string): Promise<string> => {
        try {
          const res = await axios.post("/api/messages/chat-bot", {
            prompt
          });
        
          const data = res.data;
        
          if (!data.success) {
            return "Bot couldn't think of a reply 🤯";
          }
        
          return (data.reply as string)?.trim() || "Hmm, no reply from me 😅";
        } catch (err) {
          console.error("Bot fetch error:", err);
          return "Something went wrong while talking to the bot 😬";
        }
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    }, [socket, selectedUser]);

    const value = {
        messages, users, friends, selectedUser, getUsers, getFriends, unfriend, getMsgs, sendMsg, talkToBot, setSelectedUser, unseenMessages, setUnseenMessages, showUserBox, setShowUserBox
    }

    return (
        <ChatContext.Provider value={value}>
            { children }
        </ChatContext.Provider>
    )
}