import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="lg-shell">
      <section className="lg-notfound">
        <div className="code">error · 404</div>
        <h1>Page not found</h1>
        <p>This page doesn't exist or was moved. Check the URL or go back to where you were.</p>
        <div className="actions">
          <button type="button" className="lg-btn ghost" onClick={() => navigate(-1)}>
            Go back
          </button>
          <Link to="/" className="lg-btn">Home</Link>
        </div>
      </section>
    </main>
  );
}
