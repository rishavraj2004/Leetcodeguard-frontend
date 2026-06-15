import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-dot" aria-hidden="true" />
          Streak Guard
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link${pathname === "/" ? " active" : ""}`}>
            Home
          </Link>
          <Link to="/register" className={`nav-cta${pathname === "/register" ? " active" : ""}`}>
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
