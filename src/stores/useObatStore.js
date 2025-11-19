import { defineStore } from "pinia";
import api from "@/api/axios"; // pakai instance axios

export const useObatStore = defineStore("obat", {
  state: () => ({
    stokObat: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchStokObat() {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.get("/stok-obat");
        if (res.data.success) {
          this.stokObat = res.data.data;
        }
      } catch (err) {
        console.error("Gagal mengambil data stok obat:", err);
        this.error = "Gagal mengambil data stok obat.";
      } finally {
        this.loading = false;
      }
    },

    async createObat(formData) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.post("/stok-obat", formData);

        // Tambahkan ke list jika mau update otomatis
        if (res.data?.success && res.data?.data) {
          this.stokObat.push(res.data.data);
        }

        return true;
      } catch (err) {
        console.error("Gagal membuat obat:", err);
        this.error = err.response?.data?.message || "Gagal membuat obat.";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async hapusObat(id) {
      try {
        await api.delete(`/stok-obat/${id}`);
        this.stokObat = this.stokObat.filter((o) => o.id !== id);
      } catch (err) {
        console.error("Gagal menghapus obat:", err);
        throw err;
      }
    },
  },
});
