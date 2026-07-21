import { useEffect, useRef } from "react";

export default function ConfirmDialog({
  title,
  children,
  confirmLabel = "Confirm",
  tone = "danger",
  busy = false,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    confirmRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !busy) onCancel();
    };

    // Stop the page behind the overlay from scrolling away under the dialog.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [busy, onCancel]);

  return (
    <div
      className="ad-overlay"
      onMouseDown={(e) => {
        // Only a click on the backdrop itself dismisses — not a drag that
        // happens to end there.
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div className="ad-modal" role="dialog" aria-modal="true" aria-label={title}>
        <h2>{title}</h2>
        <p>{children}</p>
        <div className="ad-modal-actions">
          <button className="lg-btn ghost small" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            ref={confirmRef}
            className={`lg-btn small${tone === "danger" ? " danger" : ""}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
