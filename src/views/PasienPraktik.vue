<template>
  <div class="praktik-container">
    <div v-if="!isLoading && praktikData.length > 0">
      <div
        v-for="praktik in praktikData"
        :key="praktik.id"
        class="praktik-card"
      >
        <div class="praktik-header">
          <h3 class="praktik-name">🏥 {{ praktik.lokasi_praktik }}</h3>
          <p class="praktik-date">
            Tanggal Praktik: **{{ formatDate(praktik.tanggal_daftar) }}**
          </p>
        </div>

        <h4 class="pasien-list-title">
          👥 Daftar Pasien (Total: {{ praktik.pasiens.length }})
        </h4>

        <div v-if="praktik.pasiens.length > 0" class="table-wrapper">
          <table class="pasien-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama</th>
                <th>NIK</th>
                <th>Tgl. Lahir</th>
                <th>Status</th>
                <th>Tgl. Daftar Pasien</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pasien, index) in praktik.pasiens" :key="pasien.id">
                <td>{{ index + 1 }}</td>
                <td>**{{ pasien.nama }}**</td>
                <td>{{ pasien.nik }}</td>
                <td>{{ formatDate(pasien.tanggal) }}</td>
                <td>
                  <span
                    :class="['status-badge', pasien.status.toLowerCase()]"
                    >{{ pasien.status }}</span
                  >
                </td>
                <td>{{ formatDate(pasien.pivot.tanggal_daftar, true) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="no-pasien">
          Tidak ada pasien terdaftar untuk lokasi praktik ini.
        </p>
      </div>
    </div>

    <div
      v-if="!isLoading && praktikData.length === 0 && isSuccess"
      class="message-box info"
    >
      Tidak ditemukan data praktik.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// --- State Reaktif ---
const API_URL = "http://127.0.0.1:8000/api/praktik/semua";

const isLoading = ref(true);
const isSuccess = ref(false);
const apiMessage = ref("");
const praktikData = ref([]);

// --- Fungsi Pengambilan Data (API Fetch) ---
const fetchData = async () => {
  isLoading.value = true;
  apiMessage.value = "";
  praktikData.value = [];

  try {
    const response = await fetch(API_URL);

    // Penanganan respons HTTP yang tidak OK (misal: 404, 500)
    if (!response.ok) {
      throw new Error(`Gagal mengambil data: Status HTTP ${response.status}`);
    }

    const json = await response.json();

    // Penanganan respons bisnis (sesuai field "success" di JSON)
    isSuccess.value = json.success;
    apiMessage.value =
      json.message ||
      (json.success
        ? "Data berhasil dimuat."
        : "Terjadi kesalahan saat memuat data.");

    if (json.success && json.data) {
      praktikData.value = json.data;
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    isSuccess.value = false;
    apiMessage.value = `Gagal terhubung ke API: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
};

// --- Fungsi Pembantu (Formatter) ---
/**
 * Fungsi untuk memformat tanggal.
 * @param {string} dateString - String tanggal dari JSON.
 * @param {boolean} isShort - Jika true, mengasumsikan format YYYY-MM-DD (dari pivot).
 * @returns {string} Tanggal yang diformat.
 */
const formatDate = (dateString, isShort = false) => {
  if (!dateString) return "-";

  try {
    const options = { year: "numeric", month: "short", day: "numeric" };

    if (isShort) {
      // Format YYYY-MM-DD
      const [year, month, day] = dateString.split("-");
      // Menggunakan new Date(year, monthIndex, day) untuk menghindari masalah zona waktu
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("id-ID", options);
    }

    // Format ISO 8601 dengan waktu (misal: 2025-11-10T00:00:00.000000Z)
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    return date.toLocaleDateString("id-ID", options);
  } catch (error) {
    return dateString;
  }
};

// --- Lifecycle Hook ---
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* --- Styling (CSS) untuk Tampilan yang Baik --- */
.praktik-container {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

/* Kotak Pesan */
.message-box {
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  font-weight: 600;
}

.loading {
  background-color: #f9f9e6;
  color: #8b8000;
  border: 1px solid #8b8000;
  text-align: center;
}

.success {
  background-color: #e6ffe6;
  color: #008000;
  border: 1px solid #008000;
}

.error {
  background-color: #ffe6e6;
  color: #ff0000;
  border: 1px solid #ff0000;
}

.info {
  background-color: #e6f7ff;
  color: #0056b3;
  border: 1px solid #0056b3;
  text-align: center;
}

/* Kartu Praktik */
.praktik-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 25px;
  padding: 20px;
  background-color: #fdfdfd;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.praktik-header {
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.praktik-name {
  color: #34495e;
  margin: 0;
}

.praktik-date {
  font-size: 0.9em;
  color: #7f8c8d;
}

.pasien-list-title {
  color: #2c3e50;
  margin-top: 20px;
  margin-bottom: 10px;
}

/* Tabel Pasien */
.table-wrapper {
  overflow-x: auto;
}

.pasien-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.pasien-table th,
.pasien-table td {
  border: 1px solid #ecf0f1;
  padding: 12px;
  text-align: left;
}

.pasien-table th {
  background-color: #3498db;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85em;
}

.pasien-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.pasien-table tr:hover {
  background-color: #f1f7fc;
}

.no-pasien {
  text-align: center;
  color: #e74c3c;
  padding: 15px;
  background-color: #fdeaea;
  border-radius: 5px;
}

/* Badge Status */
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
  text-transform: capitalize;
}

.status-badge.aktif {
  background-color: #2ecc71;
  color: white;
}
/* Tambahkan status lain jika ada (misalnya: selesai, batal) */
/*
.status-badge.selesai {
  background-color: #f39c12;
  color: white;
}
.status-badge.batal {
  background-color: #e74c3c;
  color: white;
}
*/
</style>
