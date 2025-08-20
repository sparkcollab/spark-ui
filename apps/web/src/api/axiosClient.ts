// src/api/axiosClient.ts
import axios, { AxiosError } from "axios";

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.example.com",
  timeout: 10000,
});

// 🔐 Request Interceptor — inject auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Response Interceptor — handle global errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // force logout
    }

    // Optional: handle other error statuses globally
    if (error.response?.status === 500) {
      console.error("Server error:", error);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
