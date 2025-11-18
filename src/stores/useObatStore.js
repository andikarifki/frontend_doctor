import { defineStore } from "pinia";
import axios from "axios";

export const useObatStore = defineStore("obat", {
  state: () => ({
    stokObat: [],
    loading: false,
    error: null,
    BASE_URL: "http://127.0.0.1:8000/api",
  }),

  actions: {
    async createObat(form) {
      this.loading = true;
      this.message = "";

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/stok-obat",
          form
        );

        if (response.data.success) {
          this.message = "Obat berhasil ditambahkan! 🎉";
          return true;
        }

        return false;
      } catch (error) {
        console.error("Gagal menambahkan obat:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchStokObat() {
      this.loading = true;
      this.error = null;

      try {
        const res = await axios.get(`${this.BASE_URL}/stok-obat`);
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

    async hapusObat(id) {
      try {
        await axios.delete(`${this.BASE_URL}/stok-obat/${id}`);
        this.stokObat = this.stokObat.filter((o) => o.id !== id);
      } catch (err) {
        console.error("Gagal menghapus obat:", err);
        throw err; // lempar ulang supaya component bisa kasih alert
      }
    },
  },
});
