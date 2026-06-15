import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" aria-label="Footer navigation">
      <div className="footer-inner">
        <div className="footer-section">
          <div className="footer-logo">
            <span className="footer-logo-dot" aria-hidden="true" />
            Streak Guard
          </div>
          <p className="footer-description">
            Keep your streaks alive and never miss a day.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/" className="footer-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/register" className="footer-link">
                Register
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Legal</h3>
          <ul className="footer-links">
            <li>
              <a
                href="https://github.com/rishavraj2004"
                className="footer-link"
              >
                Github
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/rishavraj04"
                className="footer-link"
              >
                Connect me on Linkedin
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Contact</h3>
          <ul className="footer-links">
            <li>
              <a href="mailto:rishav413raj@gmail.com" className="footer-link">
                rishav413raj@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {currentYear} Streak Guard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
