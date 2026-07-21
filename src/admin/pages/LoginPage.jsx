import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import Shield from "../../components/Shield";
import { useAuth } from "../auth/authContext";

export default function LoginPage() {
  const { isAuthenticated, expired, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Where the user was headed before the guard bounced them here.
  const destination = location.state?.from ?? "/admin/users";

  if (isAuthenticated) return <Navigate to={destination} replace />;

  const armed = email.trim() !== "" && password !== "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      await signIn({ email: email.trim(), password });
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ad-login-wrap">
      <div className="ad-login">
        <div className="lg-page-head" style={{ padding: "0 0 28px" }}>
          <p className="lg-eyebrow">Restricted area</p>
          <h1 className="lg-h1">
            <span className="tint-a">Admin</span> <span className="tint-b">sign in</span>
          </h1>
          <p className="lg-lead">
            {expired
              ? "Your session ended. Sign in again to continue."
              : "Credentials are checked against the values configured on the server."}
          </p>
        </div>

        <form className="lg-card" onSubmit={handleSubmit}>
          <div className="lg-pane pane-amber">
            <p className="lg-eyebrow">Identity</p>
            <h2>Who&apos;s there?</h2>
            <p className="sub">The admin email configured in the backend environment.</p>

            <label className="lg-label" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              className={`lg-input${error ? " err" : ""}`}
              type="email"
              autoComplete="username"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="lg-seam" aria-hidden="true" />
          <div className={`lg-shield${armed ? " armed" : ""}`} aria-hidden="true">
            <Shield armed={armed} size={26} />
          </div>

          <div className="lg-pane pane-blue">
            <p className="lg-eyebrow">Secret</p>
            <h2>Prove it.</h2>
            <p className="sub">Session lasts as long as the issued token stays valid.</p>

            <label className="lg-label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              className={`lg-input${error ? " err" : ""}`}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
            />

            {error && (
              <p className="lg-field-error" role="alert">
                {error}
              </p>
            )}

            <div className="lg-actions">
              <button className="lg-btn" type="submit" disabled={submitting || !armed}>
                {submitting ? "Signing in…" : "Sign in"}
              </button>
              <span className={`lg-status${error ? " bad" : ""}`}>
                <span className={`lg-dot${error ? " bad" : ""}`} />
                {submitting ? "checking…" : error ? "denied" : "awaiting credentials"}
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
