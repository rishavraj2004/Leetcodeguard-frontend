import { useRegister } from "../hooks/useRegister";
import Shield from "../components/Shield";

function SuccessPage({ registered }) {
  return (
    <main className="lg-shell">
      <section className="lg-success">
        <div className="big-shield"><Shield armed size={38} /></div>
        <h1>Guard armed</h1>
        <div className="who">
          watching {registered.leetcodeUsername} · alerting {registered.telegramChatId}
        </div>
        <div className="lg-next">
          <div className="lg-step">
            <span className="n">next</span>
            <div className="t">Open Telegram</div>
            <div className="d">
              Make sure you've started a chat with{" "}
              <a href="https://t.me/LeetcodeGuard_bot" target="_blank" rel="noreferrer">
                @LeetcodeGuard_bot
              </a>{" "}
              so it can message you.
            </div>
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
        <p className="quiet-note">
          To unsubscribe at any time, use the{" "}
          <a href="https://t.me/LeetcodeGuard_bot" target="_blank" rel="noreferrer">
            Telegram bot
          </a>.
        </p>
      </section>
    </main>
  );
}

export default function RegisterPage() {
  const {
    fields,
    fieldErrors,
    status,
    message,
    registered,
    handleChange,
    handleSubmit,
  } = useRegister();

  const isLoading = status === "loading";
  const bothFilled = fields.leetcodeUsername.trim() && fields.telegramChatId.trim();

  if (status === "success") {
    return <SuccessPage registered={registered} />;
  }

  return (
    <main className="lg-shell">
      <div className="lg-page-head">
        <div className="lg-eyebrow">Registration</div>
        <h1 className="lg-h1" style={{ fontSize: "clamp(28px, 4.5vw, 40px)" }}>
          Two IDs and you're covered.
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate style={{ marginBottom: 72 }}>
        <section className="lg-card" aria-label="Guard setup">
          <div className="lg-pane pane-amber">
            <div className="lg-eyebrow">What we watch</div>
            <h2>Your LeetCode streak</h2>
            <p className="sub">We check whether today's problem is solved on this account.</p>
            <label className="lg-label" htmlFor="leetcodeUsername">LeetCode username</label>
            <input
              id="leetcodeUsername"
              name="leetcodeUsername"
              className={`lg-input ${fieldErrors.leetcodeUsername ? "err" : ""}`}
              type="text"
              placeholder="e.g. rishav_raj"
              value={fields.leetcodeUsername}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="username"
              spellCheck="false"
              aria-invalid={!!fieldErrors.leetcodeUsername}
              aria-describedby={fieldErrors.leetcodeUsername ? "lc-err" : "lc-hint"}
            />
            {fieldErrors.leetcodeUsername ? (
              <div id="lc-err" className="lg-field-error" role="alert">
                {fieldErrors.leetcodeUsername}
              </div>
            ) : (
              <div id="lc-hint" className="lg-hint">
                The username in your profile URL: <code>leetcode.com/u/&lt;id&gt;</code>
              </div>
            )}
          </div>

          <div className="lg-pane pane-blue">
            <div className="lg-eyebrow">Where we alert you</div>
            <h2>Your Telegram</h2>
            <p className="sub">If the streak is at risk, a reminder lands here before midnight.</p>
            <label className="lg-label" htmlFor="telegramChatId">Telegram chat ID</label>
            <input
              id="telegramChatId"
              name="telegramChatId"
              className={`lg-input ${fieldErrors.telegramChatId ? "err" : ""}`}
              type="text"
              inputMode="numeric"
              placeholder="e.g. 5912384756"
              value={fields.telegramChatId}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="off"
              spellCheck="false"
              aria-invalid={!!fieldErrors.telegramChatId}
              aria-describedby={fieldErrors.telegramChatId ? "tg-err" : "tg-hint"}
            />
            {fieldErrors.telegramChatId ? (
              <div id="tg-err" className="lg-field-error" role="alert">
                {fieldErrors.telegramChatId}
              </div>
            ) : (
              <div id="tg-hint" className="lg-hint">
                Get your numeric ID by messaging{" "}
                <a href="https://t.me/LeetcodeGuard_bot" target="_blank" rel="noreferrer">
                  @LeetcodeGuard_bot
                </a>{" "}
                on Telegram
              </div>
            )}
          </div>

          <div className="lg-seam" aria-hidden="true" />
          <div className={`lg-shield ${bothFilled ? "armed" : ""}`} aria-hidden="true">
            <Shield armed={!!bothFilled} />
          </div>
        </section>

        <div className="lg-actions">
          <button
            type="submit"
            className="lg-btn"
            disabled={!bothFilled || isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Arming…" : "Activate guard"}
          </button>
          <div className={`lg-status ${status === "error" ? "bad" : ""}`} role="status">
            <span className={`lg-dot ${status === "error" ? "bad" : ""}`} />
            {status === "error"
              ? message
              : isLoading
              ? "arming — this can take a few seconds"
              : bothFilled
              ? "ready — activate to start watching"
              : "add both IDs to arm the guard"}
          </div>
        </div>
      </form>
    </main>
  );
}
