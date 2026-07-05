import { Link, NavLink } from "react-router-dom";

const LINKS = [
  ["/", "Home"],
  ["/register", "Register"],
  ["/about", "About"],
];

export default function Navbar() {
  return (
    <nav className="lg-nav" aria-label="Main navigation">
      <div className="lg-nav-inner">
        <Link to="/" className="lg-wordmark">
          <span className="half-a">LeetCode</span> <span className="half-b">Guard</span>
        </Link>
        <div className="lg-links">
          {LINKS.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => `lg-link${isActive ? " active" : ""}`}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
