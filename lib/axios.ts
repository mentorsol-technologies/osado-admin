// src/lib/axios.ts
import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
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
    if (token) {
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
    return response.data; // unwrap data so you don't need .data everywhere
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (logout, redirect, etc.)
      console.error("Unauthorized! Redirecting to login...");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
