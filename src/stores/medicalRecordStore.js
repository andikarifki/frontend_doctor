// /src/stores/medicalRecordStore.js
import { defineStore } from "pinia";
import api from "@/api/axios";

export const useMedicalRecordStore = defineStore("medicalRecord", {
  state: () => ({
    records: [],
    loading: false,
    error: "",
  }),

  actions: {
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
