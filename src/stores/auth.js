// src/stores/auth.js
import { defineStore } from "pinia";
import api from "@/api/axios";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authToken: localStorage.getItem("authToken") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.authToken,
    userRole: (state) => state.user?.role || null,
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post("/login", credentials);

        const token = response.data.access_token;
        const role = response.data.role;

        // simpan token
        this.authToken = token;
        localStorage.setItem("authToken", token);

        // simpan user sementara dulu (role saja)
        this.user = { role };
        localStorage.setItem("user", JSON.stringify(this.user));

        // ambil detail user lengkap
        await this.fetchUser();

        // redirect sesuai role
        if (role === "admin") {
          router.push("/dashboard");
        } else if (role === "apotek") {
          router.push("/medicine");
        } else {
          router.push("/dashboard");
        }

        return true;

      } catch (err) {
        // ★★ INI BAGIAN PENTING ★★
        this.error =
          err.response?.data?.message || "Username atau password salah!";

        // login gagal → JANGAN logout otomatis
        // cukup hapus token saja supaya tidak salah redirect
        this.authToken = null;
        this.user = null;
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        return false;

      } finally {
        this.loading = false;
      }
    },

    async fetchUser() {
      if (!this.isAuthenticated) return;

      try {
        const response = await api.get("/user");

        this.user = {
          ...response.data,
          role: this.user?.role || response.data.role,
        };

        localStorage.setItem("user", JSON.stringify(this.user));

      } catch (err) {
        console.error("Token invalid, auto logout");
        this.logout();
      }
    },

    logout(redirect = true) {
      this.authToken = null;
      this.user = null;
      this.error = null;
      this.loading = false;

      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      if (redirect) router.push("/login");
    },
  },
});
