import { useCallback, useMemo, useRef, useState } from "react";
import { ToastContext } from "./toastContext";

const DISMISS_AFTER_MS = 5000;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = "ok") => {
      const id = nextId.current++;
      setToasts((list) => [...list, { id, message, tone }]);
      timers.current.set(id, setTimeout(() => dismiss(id), DISMISS_AFTER_MS));
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      success: (message) => push(message, "ok"),
      error: (message) => push(message, "err"),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="ad-toasts" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className={`ad-toast ${t.tone}`} role="status">
            <span>{t.message}</span>
            <button className="x" onClick={() => dismiss(t.id)} aria-label="Dismiss">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
