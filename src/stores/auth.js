// src/stores/auth.js
import { defineStore } from "pinia";
import api from "@/api/axios"; // Pastikan path benar

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // 1. STATE: Status Otentikasi
    // Ambil Token dari Local Storage saat store diinisiasi
    authToken: localStorage.getItem("authToken") || null,
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    // 2. GETTERS: Cek apakah Token ada
    isAuthenticated: (state) => !!state.authToken,
  },

  actions: {
    // 3. ACTIONS: Panggilan API dan Modifikasi State

    // Action A: Login dan Mendapatkan Token (Panggilan ke Laravel Sanctum)
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        // Panggilan API login (POST /api/login)
        const response = await api.post("/login", credentials);
        const token = response.data.token;

        // Simpan token
        this.authToken = token;
        localStorage.setItem("authToken", token);

        // Ambil data user
        await this.fetchUser();

        // Redirect ke Dashboard (menggunakan router yang di-inject)
        this.router.push("/dashboard");
      } catch (err) {
        this.error =
          err.response?.data?.message || "Login gagal. Periksa kredensial.";
        this.logout(); // Pastikan state bersih jika gagal
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Action B: Mengambil Data Pengguna yang Dilindungi
    async fetchUser() {
      if (!this.isAuthenticated) return;
      try {
        // Panggilan API yang dilindungi (GET /api/user)
        const response = await api.get("/user");
        this.user = response.data;
      } catch (error) {
        // Jika API /user gagal, token tidak valid
        console.error("Token tidak valid, melakukan logout.");
        this.logout();
      }
    },

    // Action C: Logout
    logout() {
      this.authToken = null;
      this.user = null;
      localStorage.removeItem("authToken");
      // Redirect ke halaman login
      this.router.push("/login");
    },
  },
});
