import { defineStore } from "pinia";
import api from "@/api/axios";

export const usePasienStore = defineStore("pasien", {
  state: () => ({
    patients: [],
    loading: false,
    apiResponse: null,
    apiError: null,
  }),

  actions: {
    // 🧠 Fungsi umum untuk semua request API
    async executeApiCall(method, endpoint, data = null) {
      this.loading = true;
      this.apiError = null;
      this.apiResponse = null;

      try {
        const response = await api({ method, url: endpoint, data });

        const responseData =
          response.status === 204 || !response.data
            ? {
                message: `Operasi ${method.toUpperCase()} ${endpoint} berhasil (Status ${response.status})`,
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
          `Gagal melakukan aksi ${method.toUpperCase()} ke ${endpoint}`;

        this.apiResponse = error.response
          ? {
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data,
            }
          : null;

        console.error("API Error:", this.apiError);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 🟢 FILTER pasien berdasarkan Praktik ID
    async filterPatientsByPraktik(praktikId) {
        if (!praktikId) {
            // Jika praktikId kosong, panggil fungsi default (Tampilkan Semua)
            await this.fetchPatients();
            return;
        }

        try {
            const endpoint = `pasien/praktik/${praktikId}`;
            const response = await this.executeApiCall("get", endpoint);
            
            // Update state patients dengan data hasil filter
            this.patients = response.data.data || [];
        } catch (error) {
            console.error("Gagal filter pasien berdasarkan praktik:", error);
            this.patients = []; // Kosongkan daftar pasien jika terjadi error
            // Error ditangani di executeApiCall, jadi tidak perlu throw lagi di sini
        }
    },

    // 🟢 GET semua pasien
    async fetchPatients() {
      this.loading = true; // Set loading di sini karena executeApiCall juga set
      try {
        const response = await this.executeApiCall("get", "pasien");
        // Laravel return array langsung, pastikan assign benar
        this.patients = response.data.data || response.data || [];
      } catch (error) {
        this.patients = [];
      } finally {
        // Tidak perlu set loading = false lagi karena sudah dihandle executeApiCall
        // Tapi jika ingin memastikan, bisa dihapus dari sini.
        // Saya hilangkan 'this.loading = false' di sini agar tidak redundan dengan finally di executeApiCall
      }
    },

    // 🟢 CREATE pasien baru
    async addPatient(formData) {
      await this.executeApiCall("post", "pasien", formData);
      await this.fetchPatients();
    },

    // 🟢 UPDATE pasien
    async updatePatient(id, formData) {
      await this.executeApiCall("put", `pasien/${id}`, formData);
      await this.fetchPatients();
    },

    // 🟢 DELETE pasien
    async deletePatient(id) {
      await this.executeApiCall("delete", `pasien/${id}`);
      await this.fetchPatients();
    },

    // 🟢 CREATE medical record
    async addMedicalRecord(formData) {
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

    // 🟢 UPDATE medical record
    async updateMedicalRecord(recordId, formData) {
      const payload = {
        diagnosis: formData.diagnosis,
        tanggal_periksa: formData.tanggal_periksa,
        obat: formData.obat,
        lokasi_berobat: formData.lokasi_berobat,
      };

      await this.executeApiCall("put", `medical-records/${recordId}`, payload);
      alert(`Riwayat medis ID ${recordId} berhasil diperbarui.`);
      await this.fetchPatients();
    },

    // 🟢 DELETE medical record
    async deleteMedicalRecord(recordId, patientId) {
      try {
        await this.executeApiCall("delete", `medical-records/${recordId}`);
        alert(`Riwayat medis ID ${recordId} berhasil dihapus.`);

// Hapus langsung dari state supaya UI langsung update
 const patient = this.patients.find((p) => p.id === patientId);
        if (patient) {
          patient.medical_records = patient.medical_records.filter(
            (record) => record.id !== recordId
          );
        }
      } catch (error) {
        console.error("Gagal menghapus riwayat medis:", error);
      }
    },
  },
});