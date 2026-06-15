import { Link } from "react-router-dom";
import Footer from "../components/Footer"; // Adjust the import path as needed

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
      </main>
      <Footer />
    </>
  );
}
