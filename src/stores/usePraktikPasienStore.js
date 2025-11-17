import { defineStore } from "pinia";
import api from "@/api/axios"; // ⬅️ gunakan instance axios kamu\\

export const usePraktikPasienStore = defineStore("praktikPasien", {
  state: () => ({
    praktiks: [],
    pasiens: [],
    selectedPraktikId: "",
    loading: false,
    error: "",
  }),

  actions: {
    async fetchPraktiks() {
      this.loading = true;
      this.error = "";

      try {
        const res = await api.get("/praktik/semua");
        this.praktiks = res.data?.data || res.data || [];
      } catch (err) {
        console.error(err);
        this.error = "Gagal mengambil daftar praktik. Cek koneksi / endpoint.";
      } finally {
        this.loading = false;
      }
    },

    async fetchPasiens() {
      if (!this.selectedPraktikId) {
        this.pasiens = [];
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const res = await api.get(`/praktik/${this.selectedPraktikId}/pasiens`);
        this.pasiens = res.data?.data || res.data || [];
      } catch (err) {
        console.error(err);
        this.error = "Gagal mengambil daftar pasien. Pastikan API berjalan.";
        this.pasiens = [];
      } finally {
        this.loading = false;
      }
    },

    async hapusPasien(pasienId) {
      if (!this.selectedPraktikId) return;

      try {
        await api.delete(
          `/praktik/${this.selectedPraktikId}/pasien/${pasienId}`
        );
        await this.fetchPasiens();
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus pasien dari praktik.");
      }
    },

    formatDate(d) {
      if (!d) return "-";
      try {
        return new Date(d).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return d;
      }
    },
  },
});
