import { useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/toastContext";
import * as api from "../api/admin";

// Telegram rejects messages longer than this.
const MAX_LENGTH = 4096;

export default function AnnouncementPage() {
  const toast = useToast();

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const trimmed = message.trim();
  const tooLong = message.length > MAX_LENGTH;
  const canSend = trimmed !== "" && !tooLong && !sending;

  const send = async () => {
    setSending(true);

    try {
      const data = await api.sendAnnouncement(trimmed);
      const counts = data?.data;

      setLastResult(counts ?? null);
      setMessage("");
      toast.success(
        counts
          ? `Announcement sent — ${counts.success} delivered, ${counts.failed} failed.`
          : "Announcement sent."
      );
    } catch (err) {
      if (err.status !== 401) toast.error(err.message || "Could not send the announcement.");
    } finally {
      setSending(false);
      setConfirming(false);
    }
  };

  return (
    <main className="lg-shell wide">
      <div className="lg-page-head">
        <p className="lg-eyebrow">Broadcast</p>
        <h1 className="lg-h1">
          <span className="tint-a">Announce</span>
        </h1>
        <p className="lg-lead">
          Sends a Telegram message to every <strong>active</strong> subscriber. Unsubscribed users
          are skipped. There is no undo once it goes out.
        </p>
      </div>

      <div className="ad-announce">
        <div className="ad-panel">
          <h3>Message</h3>
          <p className="desc">
            Plain text. Delivery is one message per user, so a large user base takes a moment.
          </p>

          <label className="lg-label" htmlFor="announce-message">
            Announcement
          </label>
          <textarea
            id="announce-message"
            className={`lg-input${tooLong ? " err" : ""}`}
            placeholder="Heads up — the daily check now runs at 22:00 IST…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sending}
          />
          <div className={`ad-counter${tooLong ? " over" : ""}`}>
            {message.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
          </div>

          {tooLong && (
            <p className="lg-field-error" role="alert">
              Telegram rejects messages over {MAX_LENGTH.toLocaleString()} characters.
            </p>
          )}

          <div className="lg-actions">
            <button className="lg-btn" disabled={!canSend} onClick={() => setConfirming(true)}>
              {sending ? "Sending…" : "Send to all active users"}
            </button>
            <button
              className="lg-btn ghost"
              disabled={message === "" || sending}
              onClick={() => setMessage("")}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="ad-panel">
          <h3>Preview</h3>
          <p className="desc">Roughly how it lands in Telegram.</p>

          <div className={`ad-preview${trimmed ? "" : " empty"}`}>
            {trimmed || "Your message will appear here."}
          </div>

          {lastResult && (
            <>
              <h3 style={{ marginTop: 24 }}>Last send</h3>
              <p className="desc" style={{ marginBottom: 0 }}>
                {lastResult.success} delivered · {lastResult.failed} failed
                {lastResult.failed > 0 &&
                  " — failures usually mean the user blocked the bot or deleted the chat."}
              </p>
            </>
          )}
        </div>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Send to every active user?"
          confirmLabel="Send announcement"
          busy={sending}
          onCancel={() => setConfirming(false)}
          onConfirm={send}
        >
          This delivers a real Telegram message to all active subscribers immediately. It cannot be
          recalled.
        </ConfirmDialog>
      )}
    </main>
  );
}
