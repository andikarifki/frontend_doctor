// src/api/axios.js

import axios from "axios";

// Buat instance dengan Base URL API Laravel Anda
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // GANTI DENGAN URL API ANDA
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Interceptor: Menambahkan token ke header sebelum setiap permintaan
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // Ambil token dari Local Storage
  if (token) {
    // Menambahkan header otentikasi untuk Laravel Sanctum
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api; // Ekspor untuk digunakan di Pinia Store
