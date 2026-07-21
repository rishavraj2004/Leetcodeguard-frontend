import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./authContext";

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Remember the destination so login can send them back to it.
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
