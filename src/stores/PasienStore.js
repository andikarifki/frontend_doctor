import { defineStore } from "pinia";
import api from "@/api/axios";

export const usePasienStore = defineStore("pasien", {
  state: () => ({
    patients: [],
    loading: false,
    apiResponse: null, // Untuk logging respon terakhir
    apiError: null,
  }),
  actions: {
    async executeApiCall(method, endpoint, data = null) {
      this.loading = true;
      this.apiError = null;
      this.apiResponse = null;

      try {
        const response = await api({ method, url: endpoint, data });

        const responseData =
          response.status === 204 || !response.data
            ? {
                message: `Operasi ${method} pada ${endpoint} berhasil. (Status ${response.status})`,
              }
            : response.data;

        this.apiResponse = {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        };
        return response;
      } catch (error) {
        this.apiError =
          error.response?.data?.message ||
          error.message ||
          `Gagal melakukan aksi ${method} pada ${endpoint}.`;
        this.apiResponse = error.response
          ? {
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data,
            }
          : null;

        throw error;
      } finally {
        this.loading = false;
      }
    },

    // CRUD: READ
    async fetchPatients() {
      try {
        const response = await this.executeApiCall("get", "pasien");
        this.patients = response.data;
      } catch (error) {
        this.patients = [];
      }
    },

    // CRUD: CREATE (Pasien)
    async addPatient(formData) {
      await this.executeApiCall("post", "pasien", formData);
      await this.fetchPatients();
    },

    // CRUD: CREATE (Riwayat Medis)
    async addMedicalRecord(formData) {
      // NOTE: Sesuaikan key field dengan yang digunakan di Controller Laravel Anda
      const payload = {
        pasien_id: formData.pasien_id,
        diagnosis: formData.diagnosis,
        tanggal_periksa: formData.tanggal_periksa,
        obat: formData.obat,
        lokasi_berobat: formData.lokasi_berobat,
      };

      await this.executeApiCall("post", "medical-records", payload);
      await this.fetchPatients();
    },

    // CRUD: DELETE
    async deletePatient(id) {
      await this.executeApiCall("delete", `pasien/${id}`);
      await this.fetchPatients();
    },
  },
});
