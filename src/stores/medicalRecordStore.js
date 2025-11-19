// /src/stores/medicalRecordStore.js
import { defineStore } from "pinia";
import api from "@/api/axios";

export const useMedicalRecordStore = defineStore("medicalRecord", {
  state: () => ({
    records: [],
    allRecords: [], // ⭐ baru untuk dashboard
    loading: false,
    error: "",
  }),

  actions: {
    // 📌 Fetch rekam medis berdasarkan pasien ID
    async fetchMedicalRecords(pasienId) {
      if (!pasienId) return;

      this.loading = true;
      this.records = [];
      this.error = "";

      try {
        const res = await api.get(`/pasien/${pasienId}/medical-records`);
        this.records = res.data.data || [];
      } catch (err) {
        console.error(err);
        this.error = "Gagal memuat rekam medis";
      } finally {
        this.loading = false;
      }
    },

    // 📌 Fetch SEMUA rekam medis untuk Dashboard
    async fetchAllMedicalRecords() {
      this.loading = true;
      this.error = "";

      try {
        const res = await api.get(`/medical-records`);
        this.allRecords = res.data.data || [];
      } catch (err) {
        console.error(err);
        this.error = "Gagal memuat semua rekam medis";
      } finally {
        this.loading = false;
      }
    },

    // 📌 Tambah record
    async tambahRecord(form, pasienId) {
      try {
        const payload = {
          pasien_id: pasienId,
          ...form,
        };

        const res = await api.post(`/medical-records`, payload);
        return res.data;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },

    // 📌 Hapus record
    async hapusRecord(id) {
      try {
        await api.delete(`/medical-records/${id}`);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
});
