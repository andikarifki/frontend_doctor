import { defineStore } from "pinia";
import api from "@/api/axios";

export const usePasienStore = defineStore("pasien", {
  state: () => ({
    patients: [], // Data pasien mentah yang didapatkan dari API
    loading: false,
    apiResponse: null,
    apiError: null,
    // ASUMSI: Tambahkan state untuk query pencarian dan filter praktik
    searchQuery: "",
    selectedPraktikId: "",
  }),

  // ✨ BAGIAN BARU: GETTERS
  getters: {
    // Mengembalikan daftar praktik unik untuk filter (opsional, tapi sering digunakan)
    uniquePraktikLocations: (state) => {
      const locations = new Set();
      state.patients.forEach((patient) => {
        patient.praktiks.forEach((praktik) => {
          locations.add({
            id: praktik.id,
            lokasi: praktik.lokasi_praktik,
          });
        });
      });
      // Konversi Set kembali ke Array unik (hapus duplikasi jika ada)
      return Array.from(locations).filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i
      );
    },

    // 🎯 Getter utama untuk data yang akan ditampilkan (sudah difilter/dicari)
    filteredPatients: (state) => {
      let filtered = state.patients;
      const search = state.searchQuery.trim().toLowerCase();
      const praktikId = state.selectedPraktikId;

      // 1. Filter berdasarkan Praktik ID
      if (praktikId && praktikId !== "all") {
        const idToFilter = parseInt(praktikId);
        filtered = filtered.filter((patient) =>
          patient.praktiks.some((praktik) => praktik.id === idToFilter)
        );
      }

      // 2. Filter/Search berdasarkan Nama Pasien
      if (search) {
        filtered = filtered.filter((patient) =>
          patient.nama.toLowerCase().includes(search)
        );
      }

      return filtered;
    },
  },
  // ----------------------------------------------------

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

    // 🟢 GET semua pasien
    async fetchPatients() {
      this.loading = true;
      // Reset filter dan search sebelum fetch
      this.searchQuery = "";
      this.selectedPraktikId = "";
      try {
        const response = await this.executeApiCall("get", "pasien");
        // Simpan data mentah ke state patients
        this.patients = response.data.data || response.data || [];
      } catch (error) {
        this.patients = [];
      }
    },

    // 🟢 FILTER pasien berdasarkan Praktik ID
    // 💡 CATATAN: Fungsi ini dipertahankan karena ASUMSI sebelumnya menggunakan API endpoint
    // Jika backend TIDAK menyediakan endpoint /pasien/praktik/:id,
    // maka fungsi ini dapat diganti dengan hanya set this.selectedPraktikId = praktikId
    // dan biarkan 'filteredPatients' getter yang melakukan pemfilteran lokal.
    async filterPatientsByPraktik(praktikId) {
      this.selectedPraktikId = praktikId;
      this.searchQuery = ""; // Reset pencarian nama saat filter praktik diubah

      // Jika menggunakan API endpoint khusus filter praktik:
      // if (!praktikId || praktikId === "all") {
      //   await this.fetchPatients();
      //   return;
      // }
      // try {
      //   const endpoint = `pasien/praktik/${praktikId}`;
      //   const response = await this.executeApiCall("get", endpoint);
      //   this.patients = response.data.data || [];
      // } catch (error) {
      //   console.error("Gagal filter pasien berdasarkan praktik:", error);
      //   this.patients = [];
      // }

      // Jika menggunakan filter LOKAL (lebih efisien setelah data sudah ada):
      if (!praktikId || praktikId === "all") {
        // Jika filter direset, pastikan data yang ditampilkan adalah data lengkap
        // Namun, jika menggunakan getter, data lengkap akan terambil dari state.patients
        // Tidak perlu memanggil fetchPatients lagi, cukup set selectedPraktikId
        return;
      }
      // PENTING: Karena menggunakan getter 'filteredPatients', action ini hanya perlu
      // mengupdate state `selectedPraktikId`. Data yang ditampilkan akan otomatis
      // diperbarui melalui getter.
    },

    // 🔎 FUNGSI PENCARIAN PASIEN BERDASARKAN NAMA
    // 💡 CATATAN: Fungsi ini diubah untuk memanfaatkan pencarian API jika kueri ada,
    // dan memanfaatkan getter jika data sudah ter-fetch. Karena ASUMSI sebelumnya
    // menggunakan API endpoint /pasien/search/:query, maka kita tetap menggunakannya.
    // Jika ingin 100% menggunakan getter, action ini bisa dihapus dan
    // hanya perlu set this.searchQuery = query.
    async searchPatients() {
      const query = this.searchQuery.trim();

      // Reset filter praktik jika pencarian nama aktif
      if (query) {
        this.selectedPraktikId = "";
      }

      // Jika query kosong, kembalikan ke daftar pasien lengkap
      // Jika data pasien sudah ada, tidak perlu fetchPatients lagi, cukup return
      if (!query) {
        // Jika menggunakan API endpoint khusus search, saat query kosong,
        // kita perlu memastikan data pasien lengkap ada.
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
        // Ini akan menimpa data pasien yang sudah ada dengan hasil pencarian
        this.patients = response.data.data || response.data || [];
      } catch (error) {
        console.error("Gagal mencari pasien berdasarkan nama:", error);
        this.patients = []; // Kosongkan list jika terjadi error
      }
    },

    // 🟢 CREATE pasien baru (tetap sama)
    async addPatient(formData) {
      await this.executeApiCall("post", "pasien", formData);
      await this.fetchPatients();
    },

    // 🟢 UPDATE pasien (tetap sama)
    async updatePatient(id, formData) {
      await this.executeApiCall("put", `pasien/${id}`, formData);
      await this.fetchPatients();
    },

    // 🟢 DELETE pasien (tetap sama)
    async deletePatient(id) {
      await this.executeApiCall("delete", `pasien/${id}`);
      await this.fetchPatients();
    },

    // 🟢 CREATE medical record (tetap sama)
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

    // 🟢 UPDATE medical record (tetap sama)
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

    // 🟢 DELETE medical record (tetap sama)
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