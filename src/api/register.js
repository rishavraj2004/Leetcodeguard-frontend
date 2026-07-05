const BASE_URL = import.meta.env.VITE_API_URL || "https://leetcode-guard.onrender.com";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function registerUser({ leetcodeUsername, telegramChatId }) {
  let response;

  try {
    response = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leetcodeUsername, telegramChatId }),
    });
  } catch {
    throw new ApiError(
      "Could not connect to the server. Check your internet connection and try again.",
      0
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg =
      data?.message ||
      (response.status === 409
        ? "This LeetCode username is already registered."
        : response.status === 404
        ? "We couldn't find that LeetCode username. Check the spelling."
        : response.status === 400
        ? "Invalid input. Please check your details."
        : response.status >= 500
        ? "Server error. Please try again in a moment."
        : "Registration failed. Please try again.");
    throw new ApiError(msg, response.status);
  }

  return data;
}
