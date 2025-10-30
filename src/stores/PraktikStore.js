import { defineStore } from "pinia";
import api from "../api/axios"; // Import instance Axios yang sudah dikonfigurasi

export const usePraktikStore = defineStore("praktik", {
  state: () => ({
    praktikList: [],
    loading: false,
    error: null,
  }),

  actions: {
    // 📥 Ambil semua data praktik
    async fetchPraktikList() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get("/pendaftaran-praktik");
        this.praktikList = res.data.data || res.data;
      } catch (err) {
        console.error("❌ Gagal memuat daftar praktik:", err);
        this.error = "Gagal memuat daftar praktik. Coba periksa koneksi server.";
        this.praktikList = [];
      } finally {
        this.loading = false;
      }
    },

    // ➕ Tambah data praktik baru
    async createPraktik(payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/pendaftaran-praktik", payload);
        // Tambahkan data baru ke list agar langsung tampil tanpa reload
        this.praktikList.unshift(res.data.data || res.data);
        return res.data;
      } catch (err) {
        console.error("❌ Gagal menambah praktik:", err);
        if (err.response?.status === 422) {
          // Return error validasi dari Laravel
          return { validationErrors: err.response.data.errors };
        }
        this.error = "Gagal menambah praktik.";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // ✏️ Update data praktik berdasarkan ID
    async updatePraktik(id, payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.put(`/pendaftaran-praktik/${id}`, payload);
        // Update item di list tanpa fetch ulang
        const index = this.praktikList.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.praktikList[index] = res.data.data || res.data;
        }
        return res.data;
      } catch (err) {
        console.error("❌ Gagal mengupdate praktik:", err);
        if (err.response?.status === 422) {
          return { validationErrors: err.response.data.errors };
        }
        this.error = "Gagal memperbarui praktik.";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // 🗑️ Hapus data praktik
    async deletePraktik(id) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/pendaftaran-praktik/${id}`);
        // Hapus item dari state lokal
        this.praktikList = this.praktikList.filter((item) => item.id !== id);
      } catch (err) {
        console.error("❌ Gagal menghapus praktik:", err);
        this.error = "Gagal menghapus praktik.";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    allPraktik: (state) => state.praktikList,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
  },
});
