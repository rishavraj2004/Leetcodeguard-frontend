import { useRegister } from "../hooks/useRegister";

function IconUser() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconHash() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}

function IconAlertCircle() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function SuccessPage() {
  return (
    <div className="success-page">
      <div className="success-inner">
        <div className="success-rule" aria-hidden="true" />
        <h2>You're registered.</h2>
        <p>
          You have successfully registered. No further steps needed — you will
          now start receiving streak reminders on Telegram.
        </p>
        <p>
          To unsubscribe at any time, please use the{" "}
          <a
            href="https://t.me/LeetcodeGuard_bot"
            target="_blank"
            rel="noreferrer"
            className="success-bot-link"
          >
            Telegram bot
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const { fields, fieldErrors, status, message, handleChange, handleSubmit } =
    useRegister();

  const isLoading = status === "loading";

  if (status === "success") {
    return <SuccessPage />;
  }

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <header className="register-header">
          <h1>Register</h1>
          <p>
            Enter your LeetCode username and Telegram Chat ID to start receiving
            reminders. Registration may take some time to complete, so please
            wait for few seconds.
          </p>
        </header>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="leetcodeUsername">LeetCode username</label>
            <div className="input-wrap">
              <span className="input-icon">
                <IconUser />
              </span>
              <input
                id="leetcodeUsername"
                name="leetcodeUsername"
                type="text"
                autoComplete="username"
                placeholder="your_username"
                value={fields.leetcodeUsername}
                onChange={handleChange}
                disabled={isLoading}
                className={fieldErrors.leetcodeUsername ? "has-error" : ""}
                aria-describedby={
                  fieldErrors.leetcodeUsername ? "lc-err" : undefined
                }
                aria-invalid={!!fieldErrors.leetcodeUsername}
              />
            </div>
            {fieldErrors.leetcodeUsername && (
              <span id="lc-err" className="field-error" role="alert">
                {fieldErrors.leetcodeUsername}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="telegramChatId">Telegram Chat ID</label>
            <div className="input-wrap">
              <span className="input-icon">
                <IconHash />
              </span>
              <input
                id="telegramChatId"
                name="telegramChatId"
                type="text"
                inputMode="numeric"
                placeholder="123456789"
                value={fields.telegramChatId}
                onChange={handleChange}
                disabled={isLoading}
                className={fieldErrors.telegramChatId ? "has-error" : ""}
                aria-describedby={`tg-hint${fieldErrors.telegramChatId ? " tg-err" : ""}`}
                aria-invalid={!!fieldErrors.telegramChatId}
              />
            </div>
            {fieldErrors.telegramChatId && (
              <span id="tg-err" className="field-error" role="alert">
                {fieldErrors.telegramChatId}
              </span>
            )}
            <p id="tg-hint" className="field-hint">
              Message{" "}
              <a
                href="https://t.me/LeetcodeGuard_bot"
                target="_blank"
                rel="noreferrer"
              >
                @LeetcodeGuard_bot
              </a>{" "}
              on Telegram to get your Chat ID.
            </p>
          </div>

          <div className="form-submit">
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" aria-hidden="true" /> Registering
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>

          {status === "error" && (
            <div className="alert alert-error" role="alert">
              <IconAlertCircle />
              {message}
            </div>
          )}
        </form>

        <p className="register-note">
          We only store your username and Chat ID. No passwords, no LeetCode
          account access.
        </p>
      </div>
    </div>
  );
}
