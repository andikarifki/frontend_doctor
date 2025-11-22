import { defineStore } from "pinia";
import api from "@/api/axios";

export const usePasienStore = defineStore("pasien", {
  state: () => ({
    patients: [],
    loading: false,
    searchQuery: "",
  }),

  getters: {
    filteredPatients: (state) => {
      const s = state.searchQuery.trim().toLowerCase();
      if (!s) return state.patients;

      return state.patients.filter((p) => {
        return (
          String(p.nama || "")
            .toLowerCase()
            .includes(s) || String(p.nik || "").includes(s)
        );
      });
    },
  },

  actions: {
    // ====== UNIVERSAL API CALL ======
    async executeApiCall(method, endpoint, data = null) {
      this.loading = true;
      try {
        const response = await api({
          method,
          url: endpoint,
          data,
        });

        return response.data; // semua fungsi cukup baca ini
      } catch (error) {
        console.error("API Error:", error.response?.data || error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ====== GET LIST PASIEN ======
    async fetchPatients() {
      try {
        const res = await this.executeApiCall("get", "pasien");

        console.log("DEBUG GET PASIEN:", res);

        // Fix format Laravel
        if (Array.isArray(res.data)) {
          this.patients = res.data;
        } else if (Array.isArray(res)) {
          this.patients = res;
        } else {
          console.warn("Format API tidak dikenali, set empty");
          this.patients = [];
        }
      } catch (error) {
        console.error("Gagal fetch pasien:", error);
        this.patients = [];
      }

      this.searchQuery = "";
    },

    // ===== CREATE PASIEN =====
    async addPatient(formData) {
      try {
        const res = await this.executeApiCall("post", "pasien", formData);

        console.log("CREATE SUCCESS:", res);

        // setelah create refresh list
        await this.fetchPatients();

        return res; // penting untuk digunakan di form
      } catch (error) {
        console.error("Gagal create:", error.response?.data);
        throw error;
      }
    },

    // ===== UPDATE PASIEN =====
    async updatePatient(id, formData) {
      await this.executeApiCall("put", `pasien/${id}`, formData);
      await this.fetchPatients();
    },

    // ===== DELETE PASIEN =====
    async deletePatient(id) {
      await this.executeApiCall("delete", `pasien/${id}`);
      await this.fetchPatients();
    },

    // ===== GET DETAIL PASIEN =====
    async getPatientById(id) {
      this.loading = true;
      try {
        const res = await api.get(`pasien/show/${id}`);

        return res.data?.data || null;
      } catch (error) {
        console.error("Error get detail pasien:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
