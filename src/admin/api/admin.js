import { request, setToken, clearToken } from "./client";

const ADMIN = "/api/auth/admin";

/* ---------- auth ---------- */

export async function login({ email, password }) {
  const data = await request(`${ADMIN}/login`, {
    method: "POST",
    body: { email, password },
  });

  // The backend also sets an httpOnly cookie; we keep the token for the
  // cross-origin case where that cookie won't be sent.
  if (data?.token) setToken(data.token);

  return data;
}

export async function logout() {
  try {
    await request(`${ADMIN}/logout`, { method: "POST" });
  } finally {
    // Always drop the local token, even if the request failed — otherwise a
    // network blip would leave the panel looking logged in.
    clearToken();
  }
}

/* ---------- users ---------- */

// GET /dashboard supports filter / sort / field-limit / paginate via APIFeatures.
// It returns no total count, so we over-fetch by one row to learn whether a
// next page exists, then drop the extra before rendering.
export async function fetchUsers(
  { page = 1, limit = 20, sort = "-createdAt", isActive, leetcodeUsername, minSolved } = {},
  signal
) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit + 1));
  params.set("sort", sort);

  if (isActive === "active") params.set("isActive", "true");
  if (isActive === "inactive") params.set("isActive", "false");
  if (leetcodeUsername) params.set("leetcodeUsername", leetcodeUsername.trim().toLowerCase());
  if (minSolved !== "" && minSolved !== undefined && minSolved !== null) {
    params.set("lastSolvedCount[gte]", String(minSolved));
  }

  const data = await request(`${ADMIN}/dashboard/?${params.toString()}`, { signal });
  const rows = data?.data?.users ?? [];

  return { users: rows.slice(0, limit), hasNextPage: rows.length > limit };
}

export const subscribeUser = (id) =>
  request(`${ADMIN}/subscribe-user/${id}`, { method: "PATCH" });

export const unsubscribeUser = (id) =>
  request(`${ADMIN}/unsubscribe-user/${id}`, { method: "PATCH" });

export const deleteUser = (id) =>
  request(`${ADMIN}/remove-user/${id}`, { method: "DELETE" });

/* ---------- jobs ---------- */

export async function fetchJobStatus(signal) {
  const data = await request(`${ADMIN}/job-status`, { signal });
  return data?.data ?? [];
}

export const runDailyUpdate = () => request(`${ADMIN}/daily-update`, { method: "POST" });

export const runSendReminder = () => request(`${ADMIN}/send-reminder`, { method: "POST" });

/* ---------- announcement ---------- */

export const sendAnnouncement = (message) =>
  request(`${ADMIN}/announcement`, { method: "POST", body: { message } });
