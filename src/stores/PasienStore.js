import { defineStore } from "pinia";
import api from "@/api/axios";

export const usePasienStore = defineStore("pasien", {
  state: () => ({
    patients: [],
    loading: false,
    apiResponse: null,
    apiError: null,
    // ASUMSI: Tambahkan state untuk query pencarian dan filter praktik
    searchQuery: "",
    selectedPraktikId: "",
  }),

  actions: {
    // 🧠 Fungsi umum untuk semua request API (tetap sama)
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

    // 🟢 GET semua pasien (tetap sama)
    async fetchPatients() {
      // ... (implementasi fetchPatients sebelumnya)
      this.loading = true;
      try {
        const response = await this.executeApiCall("get", "pasien");
        this.patients = response.data.data || response.data || [];
      } catch (error) {
        this.patients = [];
      }
    },

    // 🟢 FILTER pasien berdasarkan Praktik ID (tetap sama)
    async filterPatientsByPraktik(praktikId) {
      // ... (implementasi filterPatientsByPraktik sebelumnya)
      if (!praktikId) {
        await this.fetchPatients();
        return;
      }

      try {
        const endpoint = `pasien/praktik/${praktikId}`;
        const response = await this.executeApiCall("get", endpoint);

        this.patients = response.data.data || [];
      } catch (error) {
        console.error("Gagal filter pasien berdasarkan praktik:", error);
        this.patients = [];
      }
    },

    // 🔎 FUNGSI PENCARIAN PASIEN BERDASARKAN NAMA
    async searchPatients() {
      // Ambil nilai dari state store
      const query = this.searchQuery.trim();

      // Reset filter praktik jika pencarian nama aktif
      if (query) {
        this.selectedPraktikId = "";
      }

      // Jika query kosong, kembalikan ke daftar pasien lengkap (fetchPatients)
      if (!query) {
        await this.fetchPatients();
        return;
      }

      try {
        // Gunakan encodeURIComponent pada query
        const encodedQuery = encodeURIComponent(query);
        const endpoint = `pasien/search/${encodedQuery}`;

        // Panggil API search menggunakan executeApiCall
        const response = await this.executeApiCall("get", endpoint);

        // Langsung ganti state patients dengan data hasil pencarian
        this.patients = response.data.data || response.data || [];

        // Tidak perlu set this.loading = false karena sudah dihandle executeApiCall
      } catch (error) {
        console.error("Gagal mencari pasien berdasarkan nama:", error);
        this.patients = []; // Kosongkan list jika terjadi error
        // Penanganan error (seperti menampilkan alert) dapat dilakukan di komponen yang memanggil action ini
        // atau memanfaatkan state this.apiError yang sudah diisi oleh executeApiCall
      }
    },

    // 🟢 CREATE pasien baru (tetap sama)
    async addPatient(formData) {
      // ... (implementasi addPatient sebelumnya)
      await this.executeApiCall("post", "pasien", formData);
      await this.fetchPatients();
    },

    // 🟢 UPDATE pasien (tetap sama)
    async updatePatient(id, formData) {
      // ... (implementasi updatePatient sebelumnya)
      await this.executeApiCall("put", `pasien/${id}`, formData);
      await this.fetchPatients();
    },

    // 🟢 DELETE pasien (tetap sama)
    async deletePatient(id) {
      // ... (implementasi deletePatient sebelumnya)
      await this.executeApiCall("delete", `pasien/${id}`);
      await this.fetchPatients();
    },

    // 🟢 CREATE medical record (tetap sama)
    async addMedicalRecord(formData) {
      // ... (implementasi addMedicalRecord sebelumnya)
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

    // 🟢 UPDATE medical record (tetap sama)
    async updateMedicalRecord(recordId, formData) {
      // ... (implementasi updateMedicalRecord sebelumnya)
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

    // 🟢 DELETE medical record (tetap sama)
    async deleteMedicalRecord(recordId, patientId) {
      // ... (implementasi deleteMedicalRecord sebelumnya)
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