import { useState } from "react";

// LeetCode Guard — full site (Landing · Register · About)
// Same dual light-tone system as the dashboard:
//   amber = the streak we watch (LeetCode side)
//   blue  = the channel that saves it (Telegram side)
// Wired to the real backend: POST {API}/api/register

const API_URL = "https://leetcode-guard.onrender.com";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700;800&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --paper: #FBFAF7;
  --ink: #26221D;
  --ink-soft: #8A8378;
  --line: #E7E2D9;
  --amber-tint: #FCF1DF;
  --amber-line: #EED9B4;
  --amber-deep: #B36A00;
  --blue-tint: #E9F3FA;
  --blue-line: #C8E0F0;
  --blue-deep: #1D6FA3;
  --guard-green: #2E7D4F;
  --red: #B3261E;
}
* { box-sizing: border-box; margin: 0; }

.lg-root {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
}
.lg-shell { width: 100%; max-width: 880px; margin: 0 auto; padding: 0 20px; }

/* ---------- navbar ---------- */
.lg-nav {
  position: sticky; top: 0; z-index: 10;
  background: rgba(251,250,247,0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
}
.lg-nav-inner {
  max-width: 880px; margin: 0 auto; padding: 16px 20px;
  display: flex; align-items: center; justify-content: space-between;
}
.lg-wordmark {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700; font-size: 19px; letter-spacing: -0.01em;
  background: none; border: none; cursor: pointer; padding: 0;
}
.lg-wordmark .half-a { color: var(--amber-deep); }
.lg-wordmark .half-b { color: var(--blue-deep); }
.lg-links { display: flex; gap: 4px; }
.lg-link {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px; font-weight: 500;
  background: none; border: none; cursor: pointer;
  color: var(--ink-soft); padding: 8px 14px; border-radius: 8px;
  transition: color 0.15s ease, background 0.15s ease;
}
.lg-link:hover { color: var(--ink); }
.lg-link.active { color: var(--ink); background: #F0EDE6; }
.lg-link:focus-visible, .lg-wordmark:focus-visible { outline: 2px solid var(--blue-deep); outline-offset: 2px; }

/* ---------- shared type ---------- */
.lg-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-soft); margin-bottom: 12px;
}
h1.lg-h1 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800; font-size: clamp(34px, 6vw, 54px);
  line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 18px;
}
h1.lg-h1 .tint-a { color: var(--amber-deep); }
h1.lg-h1 .tint-b { color: var(--blue-deep); }
.lg-lead { font-size: 17px; color: var(--ink-soft); line-height: 1.6; max-width: 520px; }

/* ---------- buttons ---------- */
.lg-btn {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600; font-size: 15px;
  padding: 13px 26px; border-radius: 12px; border: none; cursor: pointer;
  color: #fff; background: var(--ink);
  transition: opacity 0.15s ease, transform 0.1s ease;
}
.lg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.lg-btn:not(:disabled):hover { transform: translateY(-1px); }
.lg-btn.ghost {
  background: transparent; color: var(--ink);
  border: 1px solid var(--line);
}
.lg-btn:focus-visible { outline: 3px solid var(--blue-deep); outline-offset: 2px; }

/* ---------- landing ---------- */
.lg-hero { padding: 76px 0 56px; }
.lg-hero-cta { display: flex; gap: 12px; margin-top: 32px; flex-wrap: wrap; }

.lg-split-strip {
  display: grid; grid-template-columns: 1fr 1fr;
  border: 1px solid var(--line); border-radius: 20px; overflow: hidden;
  position: relative; margin: 8px 0 64px;
}
.lg-strip-pane { padding: 26px 28px; }
.lg-strip-pane .t {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600; font-size: 16px; margin-bottom: 4px;
}
.lg-strip-pane .d { font-size: 13.5px; color: var(--ink-soft); line-height: 1.5; }
.strip-amber { background: var(--amber-tint); }
.strip-blue { background: var(--blue-tint); }
.lg-strip-seam {
  position: absolute; left: 50%; top: 0; bottom: 0;
  border-left: 1.5px dashed #D8D2C6; transform: translateX(-50%);
}
.lg-strip-shield {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
  width: 44px; height: 44px; border-radius: 50%;
  background: #fff; border: 1px solid var(--line);
  display: flex; align-items: center; justify-content: center; z-index: 2;
}

.lg-section { padding: 8px 0 64px; }
.lg-section h2 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700; font-size: 26px; margin-bottom: 28px;
}
.lg-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.lg-step {
  background: #fff; border: 1px solid var(--line);
  border-radius: 16px; padding: 24px 22px;
}
.lg-step .n {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; margin-bottom: 14px; display: inline-block;
  padding: 3px 9px; border-radius: 999px;
}
.lg-step:nth-child(1) .n { background: var(--amber-tint); color: var(--amber-deep); }
.lg-step:nth-child(2) .n { background: #F0EDE6; color: var(--ink-soft); }
.lg-step:nth-child(3) .n { background: var(--blue-tint); color: var(--blue-deep); }
.lg-step .t {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600; font-size: 16px; margin-bottom: 6px;
}
.lg-step .d { font-size: 14px; color: var(--ink-soft); line-height: 1.55; }

.lg-cta-band {
  border: 1px solid var(--line); border-radius: 20px;
  padding: 40px; text-align: center; margin-bottom: 72px;
  background: linear-gradient(90deg, var(--amber-tint), #FBFAF7 45%, #FBFAF7 55%, var(--blue-tint));
}
.lg-cta-band h2 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700; font-size: 24px; margin-bottom: 8px;
}
.lg-cta-band p { color: var(--ink-soft); font-size: 15px; margin-bottom: 22px; }

/* ---------- register (dual card, unchanged) ---------- */
.lg-page-head { padding: 56px 0 32px; }
.lg-card {
  position: relative; display: grid; grid-template-columns: 1fr 1fr;
  border-radius: 20px; overflow: hidden; border: 1px solid var(--line);
}
.lg-pane { padding: 40px 36px 44px; }
.pane-amber { background: var(--amber-tint); }
.pane-blue { background: var(--blue-tint); }
.lg-pane .lg-eyebrow { margin-bottom: 10px; }
.pane-amber .lg-eyebrow { color: var(--amber-deep); }
.pane-blue .lg-eyebrow { color: var(--blue-deep); }
.lg-pane h2 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600; font-size: 22px; margin-bottom: 6px;
}
.lg-pane p.sub { font-size: 14px; color: var(--ink-soft); margin-bottom: 28px; line-height: 1.5; }
.lg-label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 8px; }
.lg-input {
  width: 100%; font-family: 'JetBrains Mono', monospace; font-size: 15px;
  padding: 13px 14px; border-radius: 10px; background: #fff; color: var(--ink);
  outline: none; transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.pane-amber .lg-input { border: 1px solid var(--amber-line); }
.pane-blue .lg-input { border: 1px solid var(--blue-line); }
.pane-amber .lg-input:focus { border-color: var(--amber-deep); box-shadow: 0 0 0 3px rgba(179,106,0,0.10); }
.pane-blue .lg-input:focus { border-color: var(--blue-deep); box-shadow: 0 0 0 3px rgba(29,111,163,0.10); }
.lg-input.err { border-color: var(--red) !important; }
.lg-input::placeholder { color: #B9B2A6; }
.lg-hint { font-size: 12px; color: var(--ink-soft); margin-top: 10px; line-height: 1.5; }
.lg-hint code {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  background: rgba(0,0,0,0.05); padding: 1px 5px; border-radius: 4px;
}
.lg-field-error { font-size: 12.5px; color: var(--red); margin-top: 8px; }

.lg-seam {
  position: absolute; left: 50%; top: 0; bottom: 0; width: 0;
  border-left: 1.5px dashed #D8D2C6; transform: translateX(-50%);
}
.lg-shield {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
  width: 52px; height: 52px; border-radius: 50%;
  background: #fff; border: 1px solid var(--line);
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.3s ease, box-shadow 0.3s ease; z-index: 2;
}
.lg-shield.armed { border-color: var(--guard-green); box-shadow: 0 0 0 5px rgba(46,125,79,0.10); }

.lg-actions { display: flex; align-items: center; gap: 18px; margin-top: 28px; flex-wrap: wrap; }
.lg-status {
  font-family: 'JetBrains Mono', monospace; font-size: 13px;
  color: var(--ink-soft); display: flex; align-items: center; gap: 8px;
}
.lg-status.bad { color: var(--red); }
.lg-dot { width: 8px; height: 8px; border-radius: 50%; background: #C9C2B5; }
.lg-dot.bad { background: var(--red); }

/* ---------- success ---------- */
.lg-success { text-align: center; padding: 88px 0 72px; }
.lg-success .big-shield {
  width: 84px; height: 84px; border-radius: 50%;
  background: #fff; border: 1px solid var(--guard-green);
  box-shadow: 0 0 0 8px rgba(46,125,79,0.08);
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: 28px;
}
.lg-success h1 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800; font-size: 36px; margin-bottom: 10px;
}
.lg-success .who {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px; color: var(--ink-soft); margin-bottom: 40px;
}
.lg-next {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  text-align: left; margin-bottom: 36px;
}

/* ---------- about ---------- */
.lg-about { padding: 64px 0 80px; max-width: 620px; }
.lg-about h1 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800; font-size: 38px; letter-spacing: -0.02em; margin-bottom: 20px;
}
.lg-about p { font-size: 16px; line-height: 1.7; color: #4B463E; margin-bottom: 18px; }
.lg-about .quiet { font-size: 14px; color: var(--ink-soft); }
.lg-about-links { display: flex; gap: 10px; margin-top: 30px; flex-wrap: wrap; }
.lg-chip {
  font-family: 'JetBrains Mono', monospace; font-size: 12.5px;
  padding: 8px 14px; border-radius: 999px; text-decoration: none;
  border: 1px solid var(--line); color: var(--ink);
  transition: background 0.15s ease;
}
.lg-chip:hover { background: #F0EDE6; }
.lg-chip.a { background: var(--amber-tint); border-color: var(--amber-line); }
.lg-chip.b { background: var(--blue-tint); border-color: var(--blue-line); }

/* ---------- footer ---------- */
.lg-footer {
  margin-top: auto; border-top: 1px solid var(--line);
  padding: 22px 0;
}
.lg-footer-inner {
  max-width: 880px; margin: 0 auto; padding: 0 20px;
  display: flex; justify-content: space-between; align-items: center;
  font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--ink-soft);
  flex-wrap: wrap; gap: 8px;
}

/* ---------- responsive ---------- */
@media (max-width: 680px) {
  .lg-card, .lg-split-strip { grid-template-columns: 1fr; }
  .lg-seam, .lg-strip-seam {
    left: 0; right: 0; top: 50%; bottom: auto; width: auto;
    border-left: none; border-top: 1.5px dashed #D8D2C6;
    transform: translateY(-50%);
  }
  .lg-steps, .lg-next { grid-template-columns: 1fr; }
  .lg-pane { padding: 32px 24px 36px; }
  .lg-links .lg-link { padding: 8px 10px; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;

function Shield({ armed, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 L19 6 V11.5 C19 16 16 19.2 12 21 C8 19.2 5 16 5 11.5 V6 Z"
        stroke={armed ? "#2E7D4F" : "#B9B2A6"}
        strokeWidth="1.8"
        fill={armed ? "rgba(46,125,79,0.12)" : "none"}
        strokeLinejoin="round"
      />
      {armed && (
        <path d="M9 12 L11.2 14.2 L15.2 9.8" stroke="#2E7D4F" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" fill="none" />
      )}
    </svg>
  );
}

/* =============== NAVBAR =============== */
function Navbar({ page, go }) {
  const links = [
    ["home", "Home"],
    ["register", "Register"],
    ["about", "About"],
  ];
  return (
    <nav className="lg-nav">
      <div className="lg-nav-inner">
        <button className="lg-wordmark" onClick={() => go("home")}>
          <span className="half-a">LeetCode</span> <span className="half-b">Guard</span>
        </button>
        <div className="lg-links">
          {links.map(([key, label]) => (
            <button key={key}
              className={`lg-link ${page === key ? "active" : ""}`}
              onClick={() => go(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* =============== LANDING =============== */
function HomePage({ go }) {
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
          <button className="lg-btn" onClick={() => go("register")}>Protect my streak</button>
          <button className="lg-btn ghost" onClick={() => go("about")}>Who built this</button>
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
            <div className="d">Give us your LeetCode username and Telegram chat ID. That's the whole form.</div>
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
        <button className="lg-btn" onClick={() => go("register")}>Register now</button>
      </div>
    </main>
  );
}

/* =============== REGISTER =============== */
const USERNAME_RE = /^[a-zA-Z0-9_-]{3,25}$/;
const CHATID_RE = /^-?\d+$/;

function errorForStatus(status) {
  if (status === 409) return "This LeetCode username is already registered.";
  if (status === 404) return "We couldn't find that LeetCode username. Check the spelling.";
  if (status === 400) return "The server rejected the input. Check both fields and try again.";
  if (status >= 500) return "The server had a problem. Try again in a minute.";
  return "Something went wrong. Try again.";
}

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [chatId, setChatId] = useState("");
  const [fieldErr, setFieldErr] = useState({});
  const [apiErr, setApiErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const bothFilled = username.trim() && chatId.trim();

  const validate = () => {
    const e = {};
    if (!USERNAME_RE.test(username.trim()))
      e.username = "3–25 characters: letters, numbers, _ or - only.";
    if (!CHATID_RE.test(chatId.trim()))
      e.chatId = "Must be a number, e.g. 5912384756 (a leading minus is fine).";
    setFieldErr(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    setApiErr("");
    if (!validate()) return;
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leetcodeUsername: username.trim(),
          telegramChatId: chatId.trim(),
        }),
      });
      if (res.ok) setDone(true);
      else setApiErr(errorForStatus(res.status));
    } catch {
      setApiErr("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <main className="lg-shell">
        <section className="lg-success">
          <div className="big-shield"><Shield armed size={38} /></div>
          <h1>Guard armed</h1>
          <div className="who">watching {username.trim()} · alerting {chatId.trim()}</div>
          <div className="lg-next">
            <div className="lg-step">
              <span className="n">next</span>
              <div className="t">Open Telegram</div>
              <div className="d">Make sure you've started a chat with the Guard bot so it can message you.</div>
            </div>
            <div className="lg-step">
              <span className="n">next</span>
              <div className="t">Solve today's problem</div>
              <div className="d">Checks start tonight. If today is already done, you'll hear nothing — that's good.</div>
            </div>
            <div className="lg-step">
              <span className="n">next</span>
              <div className="t">Forget about it</div>
              <div className="d">The guard runs daily on its own. It only speaks when your streak is in danger.</div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="lg-shell">
      <div className="lg-page-head">
        <div className="lg-eyebrow">Registration</div>
        <h1 className="lg-h1" style={{ fontSize: "clamp(28px, 4.5vw, 40px)" }}>
          Two IDs and you're covered.
        </h1>
      </div>

      <section className="lg-card" aria-label="Guard setup">
        <div className="lg-pane pane-amber">
          <div className="lg-eyebrow">What we watch</div>
          <h2>Your LeetCode streak</h2>
          <p className="sub">We check whether today's problem is solved on this account.</p>
          <label className="lg-label" htmlFor="lc-id">LeetCode username</label>
          <input id="lc-id"
            className={`lg-input ${fieldErr.username ? "err" : ""}`}
            type="text" placeholder="e.g. raj_porwal" value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setFieldErr((p) => ({ ...p, username: undefined }));
            }}
            autoComplete="off" spellCheck="false" />
          {fieldErr.username
            ? <div className="lg-field-error">{fieldErr.username}</div>
            : <div className="lg-hint">The username in your profile URL: <code>leetcode.com/u/&lt;id&gt;</code></div>}
        </div>

        <div className="lg-pane pane-blue">
          <div className="lg-eyebrow">Where we alert you</div>
          <h2>Your Telegram</h2>
          <p className="sub">If the streak is at risk, a reminder lands here before midnight.</p>
          <label className="lg-label" htmlFor="tg-id">Telegram chat ID</label>
          <input id="tg-id"
            className={`lg-input ${fieldErr.chatId ? "err" : ""}`}
            type="text" placeholder="e.g. 5912384756" value={chatId}
            onChange={(e) => {
              setChatId(e.target.value);
              setFieldErr((p) => ({ ...p, chatId: undefined }));
            }}
            autoComplete="off" spellCheck="false" />
          {fieldErr.chatId
            ? <div className="lg-field-error">{fieldErr.chatId}</div>
            : <div className="lg-hint">Get your numeric ID by messaging <code>@userinfobot</code> on Telegram</div>}
        </div>

        <div className="lg-seam" aria-hidden="true" />
        <div className={`lg-shield ${bothFilled ? "armed" : ""}`} aria-hidden="true">
          <Shield armed={!!bothFilled} />
        </div>
      </section>

      <div className="lg-actions" style={{ marginBottom: 72 }}>
        <button className="lg-btn" onClick={submit} disabled={!bothFilled || busy}>
          {busy ? "Arming…" : "Activate guard"}
        </button>
        <div className={`lg-status ${apiErr ? "bad" : ""}`} role="status">
          <span className={`lg-dot ${apiErr ? "bad" : ""}`} />
          {apiErr || (bothFilled ? "ready — activate to start watching" : "add both IDs to arm the guard")}
        </div>
      </div>
    </main>
  );
}

/* =============== ABOUT =============== */
function AboutPage() {
  return (
    <main className="lg-shell">
      <section className="lg-about">
        <div className="lg-eyebrow">About the builder</div>
        <h1>Built by someone who almost lost a streak.</h1>
        <p>
          I'm Raj — a backend and agentic AI engineer, B.Tech CSE student, and a
          person who grinds a public DSA challenge daily. LeetCode Guard exists
          because a streak is a stupid thing to lose to a long day, and because
          the fix is one cron job and one Telegram bot away.
        </p>
        <p>
          The stack is deliberately boring where it should be: a Node.js backend
          that checks public LeetCode activity on a schedule, a Telegram bot
          that only speaks when needed, and this React frontend — no UI library,
          no login, no data beyond the two IDs the job requires.
        </p>
        <p className="quiet">
          When not guarding streaks, I build honeypot threat-intel platforms,
          multi-agent systems, and the occasional cyberpunk terminal UI. This
          site is the quiet one in the family.
        </p>
        <div className="lg-about-links">
          <a className="lg-chip a" href="https://github.com/rishavraj2004/Leetcodeguard-frontend" target="_blank" rel="noreferrer">github ↗</a>
          <a className="lg-chip b" href="https://www.linkedin.com/in/raj-porwal-329493216" target="_blank" rel="noreferrer">linkedin ↗</a>
          <a className="lg-chip" href="https://twitter.com/raaz_porwal" target="_blank" rel="noreferrer">twitter ↗</a>
        </div>
      </section>
    </main>
  );
}

/* =============== APP =============== */
export default function LeetCodeGuardSite() {
  const [page, setPage] = useState("home");
  const go = (p) => { setPage(p); window.scrollTo(0, 0); };

  return (
    <div className="lg-root">
      <style>{CSS}</style>
      <Navbar page={page} go={go} />
      {page === "home" && <HomePage go={go} />}
      {page === "register" && <RegisterPage />}
      {page === "about" && <AboutPage />}
      <footer className="lg-footer">
        <div className="lg-footer-inner">
          <span>LeetCode Guard · streak protection</span>
          <span>daily check · 21:00 IST</span>
        </div>
      </footer>
    </div>
  );
}
