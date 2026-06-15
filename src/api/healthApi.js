
// src/api/healthApi.js

import axios from "axios";

export async function wakeServer() {
    const response = await axios.get(
        "https://leetcode-guard.onrender.com/health"
    );

    return response.data;
}