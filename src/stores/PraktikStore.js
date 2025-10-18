// src/stores/praktikStore.js (Contoh Implementasi dengan axios.js)

import { defineStore } from 'pinia';
// 💡 Import instance Axios yang sudah dikonfigurasi
import api from '../api/axios';

export const usePraktikStore = defineStore('praktik', {
  state: () => ({
    praktikList: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPraktikList() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get('/pendaftaran-praktik'); 
        
        // Simpan data ke state
        this.praktikList = res.data.data || res.data;
        
        this.loading = false;
        return this.praktikList;
      } catch (err) {
        console.error("Gagal load daftar praktik:", err);
        this.error = "Gagal memuat daftar praktik.";
        this.praktikList = []; 
        this.loading = false;
        throw err;
      }
    },
  },
  getters: {
    allPraktik: (state) => state.praktikList,
  },
});