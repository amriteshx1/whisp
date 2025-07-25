
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ObserverProvider from "./components/ObserverProvider";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <ObserverProvider>
      <BrowserRouter>
      <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </ObserverProvider>
  );
};

export default App;