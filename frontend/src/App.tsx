
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ObserverProvider from "./components/ObserverProvider";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <ObserverProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ObserverProvider>
  );
};

export default App;