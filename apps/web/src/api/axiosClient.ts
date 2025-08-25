// src/api/axiosClient.ts
import { useAuthStore } from "@/store/useAuthStore";
import axios, { AxiosError } from "axios";

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.example.com",
  timeout: 10000,
  withCredentials: true, // if you need to send cookies with requests
});

// 🔐 Request Interceptor — inject auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().userState?.token;
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

    // Optional: handle other error statuses globally
    if (error.response?.status === 500) {
      console.error("Server error:", error);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
