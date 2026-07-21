import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="lg-shell">
      <div className="lg-notfound">
        <p className="code">ERROR 404</p>
        <h1>Nothing here.</h1>
        <p>That page isn&apos;t part of the admin console.</p>
        <div className="actions">
          <Link className="lg-btn" to={isAuthenticated ? "/admin/users" : "/admin/login"}>
            {isAuthenticated ? "Back to users" : "Go to sign in"}
          </Link>
        </div>
      </div>
    </main>
  );
}
