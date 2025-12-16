// src/lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add token if available
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//  Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data; // unwrap data so you don’t need .data everywhere
  },
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Automatically log out on unauthorized
      try {
        localStorage.removeItem("token");
        Cookies.remove("token");
      } catch (e) {
        console.error("Error clearing auth data on 401:", e);
      }

      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
