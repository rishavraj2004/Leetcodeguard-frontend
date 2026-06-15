import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { wakeServer } from "../api/healthApi";

const FEATURES = [
  {
    name: "Monitoring",
    body: "Polls the LeetCode API once a day and checks whether you've solved a problem. No account access required.",
  },
  {
    name: "Reminders",
    body: "Alerts goes out at 10:00 PM IST — only if you haven't solved yet. Silent otherwise.",
  },
  {
    name: "Setup",
    body: "One-time registration. No app to install, no account to create. Works through Telegram directly.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Get your Chat ID",
    body: (
      <>
        Message /Start{" "}
        <a
          href="https://t.me/LeetcodeGuard_bot"
          target="_blank"
          rel="noreferrer"
        >
          @LeetcodeGuard_bot
        </a>{" "}
        on Telegram. It replies instantly with your numeric Chat ID.
      </>
    ),
  },
  {
    n: "2",
    title: "Register",
    body: "Enter your LeetCode username and Chat ID on the register page. That's everything.",
  },
  {
    n: "3",
    title: "Solve daily",
    body: "We handle the rest. If your streak is at risk, you'll hear from us before midnight.",
  },
];

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      try {
        await wakeServer();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-inner">
          <div className="loading-rule" />
          <div className="loading-icon">
            <div className="loading-spinner-large" />
          </div>
          <h2>Connecting to LeetCode Guard...</h2>
          <p>This may take 20–60 seconds on first visit.</p>
          <div className="loading-hint">
            <p>Wake-up request in progress — thanks for your patience.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="page">
        {/* Hero */}
        <section className="home-hero">
          <h1>
            Don't lose your
            <br />
            <em>streak</em> to a busy day.
          </h1>
          <p className="hero-desc">
            Streak Guard tracks your daily LeetCode activity and sends Telegram
            reminders before it's too late.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              Get started
            </Link>
            <a
              href="https://t.me/LeetcodeGuard_bot"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              Find my Chat ID
            </a>
          </div>
        </section>

        {/* What it does */}
        <section className="home-section">
          <div className="section-header">
            <span className="section-title">What it does</span>
            <span className="section-count">3 things</span>
          </div>
          <div className="feature-list">
            {FEATURES.map((f) => (
              <div className="feature-row" key={f.name}>
                <span className="feature-name">{f.name}</span>
                <p className="feature-body">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="home-section">
          <div className="section-header">
            <span className="section-title">How it works</span>
            <span className="section-count">3 steps</span>
          </div>
          <ol className="steps-list">
            {STEPS.map((s) => (
              <li className="step-row" key={s.n}>
                <span className="step-num">{s.n}</span>
                <div className="step-body">
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Stats Section - New */}
        <section className="home-section stats-section">
          <div className="section-header">
            <span className="section-title">Why choose us</span>
            <span className="section-count">trusted</span>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Free Forever</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">No Login</div>
              <div className="stat-label">Required</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Monitoring</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">Instant</div>
              <div className="stat-label">Setup</div>
            </div>
          </div>
        </section>

        {/* CTA Section - New */}
        <section className="home-section cta-section">
          <div className="cta-card">
            <h3>Ready to protect your streak?</h3>
            <p>Join developers who never miss a day of coding practice.</p>
            <Link to="/register" className="btn btn-primary">
              Register Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
