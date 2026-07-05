import { Link } from "react-router-dom";
import Shield from "../components/Shield";

export default function HomePage() {
  return (
    <main className="lg-shell">
      <section className="lg-hero">
        <div className="lg-eyebrow">Free · No login · One-time setup</div>
        <h1 className="lg-h1">
          Your <span className="tint-a">streak</span>, guarded.<br />
          Your <span className="tint-b">Telegram</span>, pinged.
        </h1>
        <p className="lg-lead">
          LeetCode Guard watches your daily activity and messages you on
          Telegram before midnight if today's problem is still unsolved.
          Hundreds of days of consistency shouldn't die to one busy evening.
        </p>
        <div className="lg-hero-cta">
          <Link className="lg-btn" to="/register">Protect my streak</Link>
          <Link className="lg-btn ghost" to="/about">Who built this</Link>
        </div>
      </section>

      <div className="lg-split-strip" aria-hidden="true">
        <div className="lg-strip-pane strip-amber">
          <div className="t">We watch LeetCode</div>
          <div className="d">Every evening, we check whether your account has a submission for the day.</div>
        </div>
        <div className="lg-strip-pane strip-blue">
          <div className="t">We alert on Telegram</div>
          <div className="d">Nothing solved yet? A reminder lands in your chat while there's still time.</div>
        </div>
        <div className="lg-strip-seam" />
        <div className="lg-strip-shield"><Shield armed size={20} /></div>
      </div>

      <section className="lg-section">
        <h2>How it works</h2>
        <div className="lg-steps">
          <div className="lg-step">
            <span className="n">step 1</span>
            <div className="t">Register once</div>
            <div className="d">
              Give us your LeetCode username and Telegram chat ID (message{" "}
              <a href="https://t.me/LeetcodeGuard_bot" target="_blank" rel="noreferrer">
                @LeetcodeGuard_bot
              </a>{" "}
              to get it). That's the whole form.
            </div>
          </div>
          <div className="lg-step">
            <span className="n">step 2</span>
            <div className="t">We check daily</div>
            <div className="d">A scheduled job looks at your public LeetCode activity every evening.</div>
          </div>
          <div className="lg-step">
            <span className="n">step 3</span>
            <div className="t">You get pinged</div>
            <div className="d">Streak at risk? You get a Telegram message before midnight. Solved already? Silence.</div>
          </div>
        </div>
      </section>

      <div className="lg-cta-band">
        <h2>Two IDs. Thirty seconds. Streak insured.</h2>
        <p>No account, no password, no email. Just the two things we need to do the job.</p>
        <Link className="lg-btn" to="/register">Register now</Link>
      </div>
    </main>
  );
}
