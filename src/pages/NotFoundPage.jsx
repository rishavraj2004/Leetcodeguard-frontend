import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-inner">
        <div className="not-found-rule" aria-hidden="true" />
        <h1 aria-label="Error 404">404</h1>
        <h2>Page not found</h2>
        <p>
          This page doesn't exist or was moved. Check the URL or go back to where you were.
        </p>
        <div className="not-found-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost"
          >
            Go back
          </button>
          <Link to="/" className="btn btn-primary">Home</Link>
        </div>
      </div>
    </div>
  );
}
