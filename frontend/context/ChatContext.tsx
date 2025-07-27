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
  selectedUser: ChatUser | null;
  getUsers: () => Promise<void>;
  getMsgs: (userId: string) => Promise<void>;
  sendMsg: (messageData: { text?: string; image?: string }) => Promise<void>;
  setSelectedUser: (user: ChatUser | null) => void;
  unseenMessages: Record<string, number>;
  setUnseenMessages: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatContext = createContext<ChatContextType>({} as ChatContextType);;

export const ChatProvider = ({ children }: ChatProviderProps) => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [unseenMessages, setUnseenMessages] = useState<Record<string, number>>({});

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

    //get msgs for selected user
    const getMsgs = async(userId: string) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
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
                    prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    //unsubscribe from msgs
    const unsubscribeFromMessages = ()=>{
        if(socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    }, [socket, selectedUser]);

    const value = {
        messages, users, selectedUser, getUsers, getMsgs, sendMsg, setSelectedUser, unseenMessages, setUnseenMessages 
    }

    return (
        <ChatContext.Provider value={value}>
            { children }
        </ChatContext.Provider>
    )
}