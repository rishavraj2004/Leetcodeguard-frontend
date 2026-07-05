import { useState, useCallback } from "react";
import { registerUser, ApiError } from "../api/register";

const INITIAL_FIELDS = { leetcodeUsername: "", telegramChatId: "" };
const INITIAL_ERRORS = { leetcodeUsername: "", telegramChatId: "" };

function validate({ leetcodeUsername, telegramChatId }) {
  const errors = { ...INITIAL_ERRORS };
  let valid = true;

  if (!leetcodeUsername.trim()) {
    errors.leetcodeUsername = "LeetCode username is required.";
    valid = false;
  } else if (!/^[a-zA-Z0-9_-]{3,25}$/.test(leetcodeUsername.trim())) {
    errors.leetcodeUsername = "Username must be 3–25 alphanumeric characters.";
    valid = false;
  }

  const chatId = telegramChatId.trim();
  if (!chatId) {
    errors.telegramChatId = "Telegram Chat ID is required.";
    valid = false;
  } else if (!/^-?\d+$/.test(chatId)) {
    errors.telegramChatId = "Chat ID must be a number (e.g. 123456789).";
    valid = false;
  }

  return { errors, valid };
}

export function useRegister() {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [fieldErrors, setFieldErrors] = useState(INITIAL_ERRORS);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [registered, setRegistered] = useState(INITIAL_FIELDS);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { errors, valid } = validate(fields);

      if (!valid) {
        setFieldErrors(errors);
        return;
      }

      setStatus("loading");
      setMessage("");

      const payload = {
        leetcodeUsername: fields.leetcodeUsername.trim(),
        telegramChatId: fields.telegramChatId.trim(),
      };

      try {
        const data = await registerUser(payload);
        setRegistered(payload);
        setStatus("success");
        setMessage(data.message || "You're registered! Reminders will arrive on Telegram. No further step needed now");
        setFields(INITIAL_FIELDS);
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof ApiError
            ? err.message
            : "Something went wrong. Please try again."
        );
      }
    },
    [fields]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setMessage("");
    setFieldErrors(INITIAL_ERRORS);
  }, []);

  return { fields, fieldErrors, status, message, registered, handleChange, handleSubmit, reset };
}
