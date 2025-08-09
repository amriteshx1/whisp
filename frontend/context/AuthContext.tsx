import { createContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import type { AxiosInstance } from "axios";
import toast from "react-hot-toast";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  bio?: string;
  friendCode: string;
}

interface Credentials {
  email: string;
  password: string;
  fullName?: string;
  bio?: string;
}

interface AuthContextType {
  axios: AxiosInstance;
  authUser: AuthUser | null;
  socket: Socket | null;
  onlineUsers: string[];
  login: (state: string, credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (body: Partial<AuthUser> & { profilePic?: string }) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);;

export const AuthProvider = ({ children }: AuthProviderProps) => {

    const location = useLocation();
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    //check user authentication and set user data & connect the socket
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    //login function
    const login = async(state: string, credentials: Credentials)=>{
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    //logout function
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["Authorization"] = null;
        toast.success("Logged out successfully");
        socket?.disconnect();
    }

    //update profile
    const updateProfile = async (body: Partial<AuthUser> & { profilePic?: string })=>{
        try {
            const { data } = await axios.put("/api/auth/updateProfile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated successfully")
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }


    //connect to handle socket connection and online users updates
    const connectSocket = (userData: AuthUser)=>{
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        })
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds)=>{
            setOnlineUsers(userIds);
        })
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        
        const publicRoutes = ["/", "/login"];
        if (!publicRoutes.includes(location.pathname)) {
          checkAuth();
        }

    }, [])


    const value = {
        axios,
        authUser,
        socket,
        onlineUsers,
        login,
        logout,
        updateProfile
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}