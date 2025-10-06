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

    async updateMedicalRecord(recordId, formData) {
      const payload = {
        diagnosis: formData.diagnosis,
        tanggal_periksa: formData.tanggal_periksa,
        obat: formData.obat,
        lokasi_berobat: formData.lokasi_berobat,
      };

      // Asumsi menggunakan PUT ke endpoint medical-records/{id}
      await this.executeApiCall("put", `medical-records/${recordId}`, payload);

      alert(`Riwayat Medis ID ${recordId} berhasil diperbarui.`);

      // Refresh data untuk memastikan perubahan terlihat di UI
      await this.fetchPatients();
    },

    async deleteMedicalRecord(recordId, patientId) {
      // 🟢 PERHATIKAN: Hapus baris 'this.loading = true'

      try {
        // 🟢 UBAH: Panggil executeApiCall untuk konsistensi.
        // Endpoint-nya adalah 'medical-records/{id}' dan method-nya 'delete'.
        await this.executeApiCall("delete", `medical-records/${recordId}`);

        // 1. Beri notifikasi sukses
        alert(`Riwayat Medis ID ${recordId} berhasil dihapus.`);

        // 2. Perbarui data pasien secara reaktif (logika ini sudah bagus)
        const patient = this.patients.find((p) => p.id === patientId);
        if (patient) {
          patient.medical_records = patient.medical_records.filter(
            (record) => record.id !== recordId
          );
        }
      } catch (error) {
        // error handling kini ditangani oleh executeApiCall,
        // kita tinggal menangkap error-nya di sini jika perlu aksi spesifik.
        console.error(`Gagal menghapus riwayat medis ID ${recordId}:`, error);
        // Peringatan otomatis dari executeApiCall atau gunakan this.apiError.
        // alert(`Gagal menghapus riwayat medis. Error: ${this.apiError}`);
      }
      // 🟢 PERHATIKAN: Hapus blok 'finally' yang menyetel loading = false
      // karena executeApiCall sudah menanganinya.
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
