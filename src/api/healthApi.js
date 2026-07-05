// src/api/healthApi.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://leetcode-guard.onrender.com";

export async function wakeServer() {
  const response = await axios.get(`${BASE_URL}/health`);
  return response.data;
}
