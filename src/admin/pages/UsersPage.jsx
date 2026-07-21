import { useCallback, useEffect, useMemo, useState } from "react";
import StatusPill from "../components/StatusPill";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/toastContext";
import * as api from "../api/admin";
import { formatDate, formatDateTime } from "../utils/format";

const PAGE_SIZE = 20;
const FILTER_DEBOUNCE_MS = 400;

const COLUMNS = [
  { key: "leetcodeUsername", label: "User", sortable: true },
  { key: "telegramChatId", label: "Telegram chat", sortable: true },
  { key: "lastSolvedCount", label: "Solved", sortable: true },
  { key: "isActive", label: "Status", sortable: true },
  { key: "lastReminderDate", label: "Last reminder", sortable: true },
  { key: "createdAt", label: "Joined", sortable: true },
  { key: "actions", label: "", sortable: false },
];

export default function UsersPage() {
  const toast = useToast();

  const [filters, setFilters] = useState({
    leetcodeUsername: "",
    isActive: "all",
    minSolved: "",
  });
  // Debounced mirror of the text inputs — typing shouldn't fire a request per
  // keystroke, but the dropdown should feel instant, so it is applied directly.
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const [sort, setSort] = useState({ field: "createdAt", desc: true });
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const [confirming, setConfirming] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedFilters(filters);
      setPage(1);
    }, FILTER_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [filters]);

  const query = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      sort: `${sort.desc ? "-" : ""}${sort.field}`,
      isActive: appliedFilters.isActive,
      leetcodeUsername: appliedFilters.leetcodeUsername,
      minSolved: appliedFilters.minSolved,
    }),
    [page, sort, appliedFilters]
  );

  // Bumped to force a refetch after a mutation.
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    // Cleanup runs before the next effect, so a request for stale filters is
    // aborted rather than racing the current one.
    const controller = new AbortController();

    setLoading(true);
    setError("");

    api
      .fetchUsers(query, controller.signal)
      .then(({ users: rows, hasNextPage: more }) => {
        setUsers(rows);
        setHasNextPage(more);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        // 401 is handled globally by the auth provider; don't double-report it.
        if (err.status !== 401) setError(err.message || "Could not load users.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [query, refreshKey]);

  const toggleSort = (field) => {
    setPage(1);
    setSort((current) =>
      current.field === field
        ? { field, desc: !current.desc }
        : // Dates and counts are most useful highest-first on the first click.
          { field, desc: ["createdAt", "lastSolvedCount", "lastReminderDate"].includes(field) }
    );
  };

  const runAction = async (label, id, fn) => {
    setPendingId(id);
    try {
      await fn(id);
      toast.success(label);
      refresh();
    } catch (err) {
      if (err.status !== 401) toast.error(err.message || "Action failed.");
    } finally {
      setPendingId(null);
      setConfirming(null);
    }
  };

  const activeOnPage = users.filter((u) => u.isActive).length;
  const solvedOnPage = users.reduce((sum, u) => sum + (u.lastSolvedCount || 0), 0);

  const filtersDirty =
    filters.leetcodeUsername !== "" || filters.isActive !== "all" || filters.minSolved !== "";

  return (
    <main className="lg-shell wide">
      <div className="lg-page-head">
        <p className="lg-eyebrow">Dashboard</p>
        <h1 className="lg-h1">
          <span className="tint-a">Users</span>
        </h1>
        <p className="lg-lead">
          Everyone registered for streak protection. Unsubscribing stops reminders without
          deleting the record; removing is permanent.
        </p>
      </div>

      <div className="ad-stats">
        <div className="ad-stat">
          <div className="k">On this page</div>
          <div className="v">{loading ? "—" : users.length}</div>
        </div>
        <div className="ad-stat green">
          <div className="k">Active</div>
          <div className="v">{loading ? "—" : activeOnPage}</div>
        </div>
        <div className="ad-stat amber">
          <div className="k">Inactive</div>
          <div className="v">{loading ? "—" : users.length - activeOnPage}</div>
        </div>
        <div className="ad-stat blue">
          <div className="k">Problems solved</div>
          <div className="v">{loading ? "—" : solvedOnPage.toLocaleString()}</div>
        </div>
      </div>

      <div className="ad-toolbar">
        <div className="ad-field">
          <label className="lg-label" htmlFor="f-username">
            LeetCode username
          </label>
          <input
            id="f-username"
            className="lg-input"
            placeholder="exact match"
            value={filters.leetcodeUsername}
            onChange={(e) => setFilters((f) => ({ ...f, leetcodeUsername: e.target.value }))}
          />
        </div>

        <div className="ad-field">
          <label className="lg-label" htmlFor="f-status">
            Status
          </label>
          <select
            id="f-status"
            className="lg-input"
            value={filters.isActive}
            onChange={(e) => {
              setFilters((f) => ({ ...f, isActive: e.target.value }));
              setPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="ad-field">
          <label className="lg-label" htmlFor="f-solved">
            Min solved
          </label>
          <input
            id="f-solved"
            className="lg-input"
            type="number"
            min="0"
            placeholder="0"
            value={filters.minSolved}
            onChange={(e) => setFilters((f) => ({ ...f, minSolved: e.target.value }))}
          />
        </div>

        <div className="ad-field">
          <label className="lg-label" htmlFor="f-sort">
            Sort
          </label>
          <select
            id="f-sort"
            className="lg-input"
            value={`${sort.desc ? "-" : ""}${sort.field}`}
            onChange={(e) => {
              const value = e.target.value;
              setSort({ field: value.replace(/^-/, ""), desc: value.startsWith("-") });
              setPage(1);
            }}
          >
            <option value="-createdAt">Newest first</option>
            <option value="createdAt">Oldest first</option>
            <option value="-lastSolvedCount">Most solved</option>
            <option value="lastSolvedCount">Fewest solved</option>
            <option value="leetcodeUsername">Username A–Z</option>
            <option value="-leetcodeUsername">Username Z–A</option>
          </select>
        </div>

        <div className="ad-toolbar-reset">
          <button
            className="lg-btn ghost small"
            disabled={!filtersDirty}
            onClick={() => {
              setFilters({ leetcodeUsername: "", isActive: "all", minSolved: "" });
              setPage(1);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="ad-table-wrap">
        {error ? (
          <div className="ad-empty">
            <h3>Couldn&apos;t load users</h3>
            <p>{error}</p>
            <div style={{ marginTop: 20 }}>
              <button className="lg-btn ghost small" onClick={refresh}>
                Try again
              </button>
            </div>
          </div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={col.sortable ? "sortable" : undefined}
                    onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                    aria-sort={
                      sort.field === col.key
                        ? sort.desc
                          ? "descending"
                          : "ascending"
                        : undefined
                    }
                  >
                    {col.label}
                    {sort.field === col.key && (
                      <span className="arrow" aria-hidden="true">
                        {sort.desc ? "↓" : "↑"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    {COLUMNS.map((col) => (
                      <td key={col.key}>
                        <div className="ad-skeleton" style={{ width: `${45 + ((i * 13) % 40)}%` }} />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length}>
                    <div className="ad-empty">
                      <h3>No users match</h3>
                      <p>
                        {filtersDirty
                          ? "Try loosening the filters — username matching is exact, not partial."
                          : page > 1
                            ? "You're past the last page."
                            : "Nobody has registered yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                users.map((user) => {
                  const busy = pendingId === user._id;

                  return (
                    <tr key={user._id}>
                      <td>
                        <div className="ad-user">
                          <span className="name">{user.leetcodeUsername}</span>
                          <span className="id">{user._id}</span>
                        </div>
                      </td>
                      <td className="mono">{user.telegramChatId}</td>
                      <td className="mono">{(user.lastSolvedCount ?? 0).toLocaleString()}</td>
                      <td>
                        <StatusPill tone={user.isActive ? "green" : "grey"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </StatusPill>
                      </td>
                      <td className="mono">{formatDate(user.lastReminderDate)}</td>
                      <td className="mono">{formatDateTime(user.createdAt)}</td>
                      <td className="right">
                        <div className="ad-row-actions">
                          {user.isActive ? (
                            <button
                              className="lg-btn ghost small"
                              disabled={busy}
                              onClick={() =>
                                runAction(
                                  `${user.leetcodeUsername} unsubscribed.`,
                                  user._id,
                                  api.unsubscribeUser
                                )
                              }
                            >
                              Unsubscribe
                            </button>
                          ) : (
                            <button
                              className="lg-btn ghost small"
                              disabled={busy}
                              onClick={() =>
                                runAction(
                                  `${user.leetcodeUsername} resubscribed.`,
                                  user._id,
                                  api.subscribeUser
                                )
                              }
                            >
                              Subscribe
                            </button>
                          )}
                          <button
                            className="lg-btn danger small"
                            disabled={busy}
                            onClick={() => setConfirming(user)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>

      <div className="ad-pager">
        <span className="count">
          page {page}
          {!loading && ` · ${users.length} shown`}
        </span>
        <div className="controls">
          <button
            className="lg-btn ghost small"
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Previous
          </button>
          <button
            className="lg-btn ghost small"
            disabled={!hasNextPage || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Remove this user?"
          confirmLabel="Remove permanently"
          busy={pendingId === confirming._id}
          onCancel={() => setConfirming(null)}
          onConfirm={() =>
            runAction(`${confirming.leetcodeUsername} removed.`, confirming._id, api.deleteUser)
          }
        >
          <span className="mono">{confirming.leetcodeUsername}</span> will be deleted from the
          database and will stop receiving reminders. This cannot be undone — to pause reminders
          instead, unsubscribe them.
        </ConfirmDialog>
      )}
    </main>
  );
}
