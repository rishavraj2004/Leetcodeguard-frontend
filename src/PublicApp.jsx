import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Shield from "./components/Shield";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import { wakeServer } from "./api/healthApi";

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

// Rendered under the top-level "/*" route, so child paths are relative (no
// leading slash) — an absolute path nested under a splat route is invalid in
// react-router v6.
export default function PublicApp() {
  const waking = useWakeServer();

  return (
    <div className="lg-root">
      <Navbar />
      {waking ? (
        <WakeScreen />
      ) : (
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
      <Footer />
    </div>
  );
}
