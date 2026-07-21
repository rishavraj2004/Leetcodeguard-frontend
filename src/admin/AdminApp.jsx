import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Shield from "../components/Shield";
import ToastProvider from "./components/ToastProvider";
import { useToast } from "./components/toastContext";
import AuthProvider from "./auth/AuthProvider";
import RequireAuth from "./auth/RequireAuth";
import { useAuth } from "./auth/authContext";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import JobsPage from "./pages/JobsPage";
import AnnouncementPage from "./pages/AnnouncementPage";
import NotFoundPage from "./pages/NotFoundPage";
import { wakeServer } from "../api/healthApi";
import "./admin.css";

// Same cold-start gate as the public site: Render spins the backend down after
// ~15 min idle. Only show the wake screen if /health doesn't answer quickly.
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
        <div className="ring">
          <Shield armed size={34} />
        </div>
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

function Shell() {
  const waking = useWakeServer();
  const { isAuthenticated, signOut } = useAuth();
  const toast = useToast();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      toast.success("Signed out.");
    } catch {
      // signOut clears the local token regardless, so the user is out either way.
      toast.error("Signed out locally, but the server didn't confirm.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    // .ad-app scopes the admin's wider layout + input defaults so the public
    // site's chrome is untouched.
    <div className="ad-app lg-root">
      <Navbar onSignOut={handleSignOut} signingOut={signingOut} />

      {waking ? (
        <WakeScreen />
      ) : (
        <Routes>
          <Route
            index
            element={<Navigate to={isAuthenticated ? "/admin/users" : "/admin/login"} replace />}
          />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="users"
            element={
              <RequireAuth>
                <UsersPage />
              </RequireAuth>
            }
          />
          <Route
            path="jobs"
            element={
              <RequireAuth>
                <JobsPage />
              </RequireAuth>
            }
          />
          <Route
            path="announce"
            element={
              <RequireAuth>
                <AnnouncementPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}

      <Footer />
    </div>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </AuthProvider>
  );
}
