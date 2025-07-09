
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ObserverProvider from "./components/ObserverProvider";

const App = () => {
  return (
    <ObserverProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </ObserverProvider>
  );
};

export default App;