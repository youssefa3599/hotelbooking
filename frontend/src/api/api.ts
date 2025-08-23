// src/api/api.ts
import axios from "axios";

// 🌍 Centralized Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // allows sending cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// 📌 Add token automatically if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("📡 [API] Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ [API] Request error:", error);
    return Promise.reject(error);
  }
);

// 🛑 Global error handling (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🔒 Unauthorized - redirecting to login?");
      // Optionally logout user
    }
    return Promise.reject(error);
  }
);

export default api;
