// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 🔥 ambil dari .env
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // penting kalau pakai Sanctum
});

// Interceptor: tambah Authorization kalau ada token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// 🔍 Log untuk cek koneksi ENV
console.log("🌍 Base URL dari ENV:", import.meta.env.VITE_API_BASE_URL);

export default api;
