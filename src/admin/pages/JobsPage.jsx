import { useCallback, useEffect, useState } from "react";
import StatusPill from "../components/StatusPill";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/toastContext";
import * as api from "../api/admin";
import { formatDateTime, jobIndicator, relativeTime } from "../utils/format";

// The two jobs the backend tracks. Listed statically so a job that has never
// run still gets a card (the API only returns rows that exist).
const JOBS = [
  {
    name: "daily-update",
    title: "Daily update",
    desc: "Refreshes every active user's solved count from LeetCode. Run this if the stored counts look stale.",
    run: api.runDailyUpdate,
    confirm:
      "This queries LeetCode for every active user and rewrites their stored solved count. It may take a while on a large user base.",
  },
  {
    name: "send-reminder",
    title: "Send reminders",
    desc: "Checks who hasn't solved a problem today and sends them a Telegram nudge.",
    run: api.runSendReminder,
    confirm:
      "This messages every active user who hasn't solved a problem today. They will receive a real Telegram notification.",
  },
];

const REFRESH_INTERVAL_MS = 30000;

export default function JobsPage() {
  const toast = useToast();

  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(null);
  const [confirming, setConfirming] = useState(null);

  const load = useCallback((signal, { quiet = false } = {}) => {
    if (!quiet) setLoading(true);

    return api
      .fetchJobStatus(signal)
      .then((rows) => {
        setStatuses(rows);
        setError("");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        if (err.status !== 401) setError(err.message || "Could not load job status.");
      })
      .finally(() => {
        if (!signal?.aborted) setLoading(false);
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);

    // Keep the indicators honest while the tab sits open — a cron run
    // elsewhere should show up without a manual reload.
    const timer = setInterval(() => load(controller.signal, { quiet: true }), REFRESH_INTERVAL_MS);

    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [load]);

  const triggerJob = async (job) => {
    setRunning(job.name);
    setConfirming(null);

    try {
      const result = await job.run();
      toast.success(result?.message || `${job.title} completed.`);
    } catch (err) {
      if (err.status !== 401) toast.error(err.message || `${job.title} failed.`);
    } finally {
      setRunning(null);
      load(null, { quiet: true });
    }
  };

  return (
    <main className="lg-shell wide">
      <div className="lg-page-head">
        <p className="lg-eyebrow">Observability</p>
        <h1 className="lg-h1">
          <span className="tint-b">Jobs</span>
        </h1>
        <p className="lg-lead">
          Status of the scheduled jobs, and manual triggers for running them out of band. Green
          means it succeeded today; amber means it hasn&apos;t run today at all.
        </p>
      </div>

      {error && (
        <div className="ad-panel" style={{ marginBottom: 20 }}>
          <h3>Couldn&apos;t load job status</h3>
          <p className="desc">{error}</p>
          <button className="lg-btn ghost small" onClick={() => load(null)}>
            Try again
          </button>
        </div>
      )}

      <div className="ad-jobs">
        {JOBS.map((job) => {
          const status = statuses.find((s) => s.jobName === job.name);
          const indicator = jobIndicator(status);
          const isRunning = running === job.name;

          return (
            <section className="ad-job" key={job.name}>
              <div className="ad-job-head">
                <div>
                  <h3>{job.title}</h3>
                  <p className="desc">{job.desc}</p>
                </div>
                {loading ? (
                  <div className="ad-skeleton" style={{ width: 92, height: 26, borderRadius: 999 }} />
                ) : (
                  <StatusPill tone={indicator.tone}>{indicator.label}</StatusPill>
                )}
              </div>

              <dl>
                <dt>Job</dt>
                <dd
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}
                >
                  {job.name}
                </dd>

                <dt>Last run</dt>
                <dd>
                  {status?.lastRun ? (
                    <>
                      {formatDateTime(status.lastRun)}{" "}
                      <span style={{ color: "var(--ink-soft)" }}>({relativeTime(status.lastRun)})</span>
                    </>
                  ) : (
                    "Never"
                  )}
                </dd>

                <dt>Result</dt>
                <dd>{status?.message || "—"}</dd>
              </dl>

              <div className="ad-job-foot">
                <button
                  className="lg-btn small"
                  disabled={isRunning || running !== null}
                  onClick={() => setConfirming(job)}
                >
                  {isRunning ? "Running…" : "Run now"}
                </button>
              </div>
            </section>
          );
        })}
      </div>

      {confirming && (
        <ConfirmDialog
          title={`Run ${confirming.title.toLowerCase()} now?`}
          confirmLabel="Run job"
          tone="default"
          busy={running === confirming.name}
          onCancel={() => setConfirming(null)}
          onConfirm={() => triggerJob(confirming)}
        >
          {confirming.confirm}
        </ConfirmDialog>
      )}
    </main>
  );
}
