<template>
  <div class="pasien-list">
    <h1>
      <span role="img" aria-label="Hospital Emoji">🏥</span> Daftar Pasien di
      {{ praktikName }}
    </h1>

    <div v-if="loading" class="loading">
      Memuat data... <span role="img" aria-label="Loading Emoji">⏳</span>
    </div>

    <div v-if="error" class="error">
      Terjadi kesalahan: {{ error }}
      <span role="img" aria-label="Error Emoji">❌</span>
    </div>

    <table v-if="pasiens.length" class="pasien-table">
      <thead>
        <tr>
          <th>No</th>
          <th>NIK</th>
          <th>Nama Pasien</th>
          <th>Tanggal Daftar</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pasien, index) in pasiens" :key="pasien.id">
          <td>{{ index + 1 }}</td>
          <td>{{ pasien.nik }}</td>
          <td>{{ pasien.nama }}</td>
          <td>{{ formatDate(pasien.pivot.tanggal_daftar) }}</td>
          <td>{{ pasien.status }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="!loading && !error" class="no-data">
      Tidak ada data pasien yang tersedia.
      <span role="img" aria-label="No Data Emoji">ℹ️</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// URL API
const API_URL = "http://127.0.0.1:8000/api/praktik/2/pasiens";

// State Reaktif
const pasiens = ref([]);
const loading = ref(true);
const error = ref(null);
const praktikName = ref("RS Sehat Sentosa"); // Nilai default, bisa diupdate jika data API mengandung nama praktik

// Fungsi untuk mengambil data dari API
const fetchPasiens = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(API_URL);

    // Asumsi struktur respons: { success: true, message: "...", data: [...] }
    if (response.data.success && response.data.data) {
      pasiens.value = response.data.data;

      // Mengambil nama praktik dari 'message' jika diperlukan
      const message = response.data.message;
      const match = message.match(/Daftar pasien di praktik: (.+)/);
      if (match && match[1]) {
        praktikName.value = match[1];
      }
    } else {
      error.value = "Struktur data API tidak valid.";
    }
  } catch (err) {
    console.error("Gagal mengambil data pasien:", err);
    error.value =
      "Gagal terhubung ke API atau ada masalah saat mengambil data.";
  } finally {
    loading.value = false;
  }
};

// Fungsi utilitas untuk memformat tanggal
const formatDate = (dateString) => {
  if (!dateString) return "-";
  // Mengambil hanya bagian tanggal (YYYY-MM-DD)
  const datePart = dateString.split("T")[0];
  // Mengubah format YYYY-MM-DD ke DD-MM-YYYY (atau sesuai preferensi)
  const [year, month, day] = datePart.split("-");
  return `${day}-${month}-${year}`;
};

// Panggil fungsi fetchPasiens saat komponen selesai di-mount
onMounted(fetchPasiens);
</script>

<style scoped>
.pasien-list {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.loading,
.error,
.no-data {
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-weight: bold;
}

.loading {
  background-color: #e0f7fa;
  color: #00796b;
}

.error {
  background-color: #ffebee;
  color: #c62828;
}

.no-data {
  background-color: #fff3e0;
  color: #ff8f00;
}

.pasien-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pasien-table th,
.pasien-table td {
  border: 1px solid #ddd;
  padding: 12px 8px;
  text-align: left;
}

.pasien-table th {
  background-color: #00bcd4; /* Warna header */
  color: white;
  text-transform: uppercase;
  font-size: 14px;
}

.pasien-table tr:nth-child(even) {
  background-color: #f4f8f9; /* Warna baris genap */
}

.pasien-table tr:hover {
  background-color: #e0f7fa; /* Efek hover */
}

/* Penyesuaian kolom */
.pasien-table td:first-child {
  text-align: center;
}
</style>
