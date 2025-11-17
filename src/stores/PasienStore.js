import { defineStore } from "pinia";
import api from "@/api/axios";

export const usePasienStore = defineStore("pasien", {
  state: () => ({
    patients: [],
    loading: false,
    searchQuery: "",
  }),

  getters: {
    // Pasien yang sudah difilter berdasarkan searchQuery (Nama & NIK)
    filteredPatients: (state) => {
      const search = state.searchQuery.trim().toLowerCase();
      if (!search) return state.patients;

      return state.patients.filter((p) => {
        const nama = String(p.nama || "").toLowerCase();
        const nik = String(p.nik || ""); // NIK jadi string
        return nama.includes(search) || nik.includes(search);
      });
    },
  },

  actions: {
    // Fungsi umum untuk API
    async executeApiCall(method, endpoint, data = null) {
      this.loading = true;
      try {
        const response = await api({ method, url: endpoint, data });
        return response.data?.data || response.data || [];
      } catch (error) {
        console.error("API Error:", error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    // Ambil semua pasien
    async fetchPatients() {
      this.patients = await this.executeApiCall("get", "pasien");
      this.searchQuery = "";
    },

    // Set query pencarian
    setSearchQuery(query) {
      this.searchQuery = query;
    },

    // Tambah pasien
    async addPatient(formData) {
      await this.executeApiCall("post", "pasien", formData);
      await this.fetchPatients();
    },

    // Update pasien
    async updatePatient(id, formData) {
      await this.executeApiCall("put", `pasien/${id}`, formData);
      await this.fetchPatients();
    },

    // Hapus pasien
    async deletePatient(id) {
      await this.executeApiCall("delete", `pasien/${id}`);
      await this.fetchPatients();
    },
  },
});
