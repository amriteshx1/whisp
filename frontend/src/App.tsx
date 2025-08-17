
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

  const { authUser } = useContext(AuthContext);

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