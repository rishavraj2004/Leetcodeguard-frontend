// Same backend the public site talks to (see src/api/register.js), but the
// admin routes are behind JWT. Cross-origin, so we send both the httpOnly
// cookie (when same-site) and a Bearer token fallback.
export const BASE_URL = (
  import.meta.env.VITE_API_URL || "https://leetcode-guard.onrender.com"
).replace(/\/$/, "");

const TOKEN_KEY = "lg_admin_token";

// sessionStorage, not localStorage: the token dies with the tab, which limits
// the window in which a stolen token is useful. The backend also sets an
// httpOnly cookie; that one is preferred whenever the panel is same-origin.
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token) => sessionStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Set by AuthProvider so an expired session bounces to the login screen from
// anywhere, instead of every caller having to special-case 401.
let unauthorizedHandler = null;
export const onUnauthorized = (fn) => {
  unauthorizedHandler = fn;
};

const messageForStatus = (status) => {
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "You are not allowed to do that.";
  if (status === 404) return "Not found.";
  if (status === 429) return "Too many requests. Wait a moment and try again.";
  if (status >= 500) return "Server error. Please try again in a moment.";
  return "Request failed. Please try again.";
};

export async function request(path, { method = "GET", body, signal } = {}) {
  const token = getToken();
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      credentials: "include", // send the httpOnly JWT cookie when same-site
      headers: {
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(
      "Could not reach the server. Check your connection and try again.",
      0
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
      unauthorizedHandler?.();
    }
    throw new ApiError(data?.message || messageForStatus(response.status), response.status);
  }

  return data;
}
