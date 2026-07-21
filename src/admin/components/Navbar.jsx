import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/authContext";

const LINKS = [
  ["/admin/users", "Users"],
  ["/admin/jobs", "Jobs"],
  ["/admin/announce", "Announce"],
];

export default function Navbar({ onSignOut, signingOut }) {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="lg-nav" aria-label="Admin navigation">
      <div className="lg-nav-inner">
        <Link to={isAuthenticated ? "/admin/users" : "/admin/login"} className="lg-wordmark">
          <span>
            <span className="half-a">LeetCode</span> <span className="half-b">Guard</span>
          </span>
          <span className="ad-badge">admin</span>
        </Link>

        {isAuthenticated && (
          <div className="lg-links">
            {LINKS.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `lg-link${isActive ? " active" : ""}`}
              >
                {label}
              </NavLink>
            ))}
            <span className="ad-nav-divider" aria-hidden="true" />
            <button className="lg-link" onClick={onSignOut} disabled={signingOut}>
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
