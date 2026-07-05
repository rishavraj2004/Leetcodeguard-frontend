import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Shield from "./components/Shield";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import { wakeServer } from "./api/healthApi";
import "./App.css";

// Render free tier spins the backend down after ~15 min idle. Ping /health on
// first load; only show the wake-up screen if the reply hasn't come back fast
// (i.e. an actual cold start), so warm visits never see a loader flash.
const COLD_START_THRESHOLD_MS = 1500;

function useWakeServer() {
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) setWaking(true);
    }, COLD_START_THRESHOLD_MS);

    wakeServer()
      .catch((error) => console.error("wake-up ping failed:", error))
      .finally(() => {
        clearTimeout(timer);
        if (active) setWaking(false);
      });

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  return waking;
}

function WakeScreen() {
  return (
    <div className="lg-loading" role="status">
      <div>
        <div className="ring"><Shield armed size={34} /></div>
        <h1>Connecting to LeetCode Guard…</h1>
        <p className="sub">This may take 20–60 seconds.</p>
        <div className="wire">
          <span className="pulse-dot" />
          Wake-up request in progress — thanks for your patience
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const waking = useWakeServer();

  return (
    <BrowserRouter>
      <div className="lg-root">
        <Navbar />
        {waking ? (
          <WakeScreen />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
