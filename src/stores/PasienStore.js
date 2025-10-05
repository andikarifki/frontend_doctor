// src/stores/pasienStore.js
import { defineStore } from "pinia";
import api from "@/api/axios";
// Pastikan file axios.js Anda mendukung PATCH/PUT

export const usePasienStore = defineStore("pasien", {
  state: () => ({
    patients: [],
    loading: false,
    apiResponse: null,
    apiError: null,
  }),
  actions: {
    async executeApiCall(method, endpoint, data = null) {
      // ... (Fungsi ini tetap sama)
      this.loading = true;
      this.apiError = null;
      this.apiResponse = null;

      try {
        // Karena Laravel sering menggunakan POST dengan _method:PUT/PATCH
        // untuk form HTML, kita gunakan PUT/PATCH native di Axios.
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

    // CRUD: READ (Tetap Sama)
    async fetchPatients() {
      // ...
      try {
        const response = await this.executeApiCall("get", "pasien");
        this.patients = response.data;
      } catch (error) {
        this.patients = [];
      }
    },

    // CRUD: CREATE Pasien (Tetap Sama)
    async addPatient(formData) {
      await this.executeApiCall("post", "pasien", formData);
      await this.fetchPatients();
    },

    // CRUD: CREATE Riwayat Medis (Pastikan field sesuai error validasi Anda)
    async addMedicalRecord(formData) {
      // Mengirim payload dengan nama field persis seperti yang diminta oleh error validasi Anda.
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

    // 🆕 CRUD: UPDATE PASIEN (PUT/PATCH)
    async updatePatient(id, formData) {
      // Pilihan 1: PUT Native (Paling Bersih, Umumnya Berhasil)
      await this.executeApiCall("put", `pasien/${id}`, formData);

      // Pilihan 2: POST dengan Method Spoofing (Jika PUT/PATCH gagal)
      /*
    const dataToSend = { ...formData, _method: 'PUT' };
    await this.executeApiCall('post', `pasien/${id}`, dataToSend);
    */

      await this.fetchPatients(); // Refresh data pasien setelah update
    },

    // CRUD: DELETE (Tetap Sama)
    async deletePatient(id) {
      await this.executeApiCall("delete", `pasien/${id}`);
      await this.fetchPatients();
    },
  },
});
