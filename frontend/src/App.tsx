
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import FriendPage from "./pages/FriendPage";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const App = () => {

  const { authUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="h-screen w-screen bg-[radial-gradient(ellipse_at_bottom_left,#022c22,#000000,#000000)] bg-cover flex justify-center items-center"><p className="md:text-2xl text-xl text-neutral-700 animate-pulse">Taking u there in a moment, don't forget to take a breather!</p></div>;
  }

  return (
    <>
      <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/home"} />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to={"/"} />} />
          <Route path="/friends" element={authUser ? <FriendPage /> : <Navigate to={"/"} />} />
        </Routes>
    </>
  );
};

export default App;