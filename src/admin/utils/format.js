const DATE_TIME = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : DATE_TIME.format(date);
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString(undefined, { dateStyle: "medium" });
}

export function isToday(value) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function relativeTime(value) {
  if (!value) return "never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";

  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";

  const units = [
    ["minute", 60],
    ["hour", 60],
    ["day", 24],
    ["month", 30.44],
    ["year", 12],
  ];

  let amount = seconds / 60;
  let unit = "minute";

  for (let i = 0; i < units.length; i++) {
    const [name, nextDivisor] = units[i];
    unit = name;
    if (Math.abs(amount) < nextDivisor || i === units.length - 1) break;
    amount /= nextDivisor;
  }

  const rounded = Math.round(amount);
  return `${rounded} ${unit}${rounded === 1 ? "" : "s"} ago`;
}

// The traffic-light rule the backend asks for in routes/adminRoutes.js:
// ran today + SUCCESS -> green, ran today + FAILED -> red, otherwise stale.
export function jobIndicator(job) {
  if (!job?.lastRun) return { tone: "grey", label: "Never run" };
  if (!isToday(job.lastRun)) return { tone: "amber", label: "Not run today" };
  return job.status === "SUCCESS"
    ? { tone: "green", label: "Success" }
    : { tone: "red", label: "Failed" };
}
