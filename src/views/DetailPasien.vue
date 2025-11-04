<template>
  <div class="pasien-detail">
    <div v-if="isLoading" class="loading-state">
      <h3>Memuat data pasien ID: {{ pasienId }}... ⏳</h3>
    </div>

    <div v-else-if="error" class="error-state">
      <h3>Gagal memuat data 🚨</h3>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!pasien.id" class="not-found-state">
      <h3>Data Pasien ID: {{ pasienId }} Tidak Ditemukan 🚫</h3>
    </div>

    <div v-else>
      <h2>Detail Pasien: {{ pasien.nama }}</h2>
      <hr />

      <div class="data-section">
        <h3>Informasi Dasar</h3>
        <table>
          <tbody>
            <tr>
              <th>ID:</th>
              <td>{{ pasien.id }}</td>
            </tr>
            <tr>
              <th>NIK:</th>
              <td>{{ pasien.nik }}</td>
            </tr>
            <tr>
              <th>Nama:</th>
              <td>{{ pasien.nama }}</td>
            </tr>
            <tr>
              <th>Tanggal Lahir:</th>
              <td>{{ formatDate(pasien.tanggal) }}</td>
            </tr>
            <tr>
              <th>Status:</th>
              <td>
                <span :class="statusClass">{{ pasien.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <div class="data-section">
        <h3>Daftar Praktik</h3>
        <div v-if="pasien.praktiks && pasien.praktiks.length > 0">
          <table>
            <thead>
              <tr>
                <th>ID Praktik</th>
                <th>Lokasi Praktik</th>
                <th>Tanggal Pendaftaran</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="praktik in pasien.praktiks" :key="praktik.id">
                <td>{{ praktik.id }}</td>
                <td>{{ praktik.lokasi_praktik }}</td>
                <td>{{ formatDate(praktik.tanggal_daftar) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else>Pasien ini belum terdaftar di praktik manapun.</p>
      </div>

      <hr />

      <div class="data-section">
        <h3>Catatan Medis</h3>
        <p
          v-if="!pasien.medical_records || pasien.medical_records.length === 0"
        >
          Belum ada catatan medis.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router"; // 👈 Import hook dari Vue Router

// Inisialisasi router
const route = useRoute();

// --- State Management ---
const pasien = ref({});
const isLoading = ref(true);
const error = ref(null);

// 🚀 AMBIL ID PASIEN SECARA DINAMIS DARI PARAMETER URL
const pasienId = computed(() => route.params.id);

// --- Computed Properties ---

// Menentukan class CSS berdasarkan status
const statusClass = computed(() => {
  const status = pasien.value.status;
  if (status === "Aktif") {
    return "status-aktif";
  } else if (status === "Tidak Aktif") {
    return "status-tidak-aktif";
  }
  return "";
});

// --- Methods ---

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    // Periksa jika tanggal tidak valid
    // Handling for YYYY-MM-DD format (like in pivot)
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
    }
    return dateString;
  }

  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("id-ID", options);
};

// Fungsi untuk mengambil data dari API
const fetchPasienData = async (id) => {
  if (!id) {
    isLoading.value = false;
    error.value = "ID Pasien tidak ditemukan di URL.";
    return;
  }

  isLoading.value = true;
  error.value = null;
  pasien.value = {}; // Reset data pasien saat memuat baru

  // 🚀 GUNAKAN ID DINAMIS UNTUK MEMBANGUN URL
  const API_URL = `http://127.0.0.1:8000/api/pasien/show/${id}`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Gagal mengambil data. Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      pasien.value = data.data;
    } else {
      throw new Error(data.message || "Data pasien tidak ditemukan.");
    }
  } catch (err) {
    console.error("Error fetching pasien data:", err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

// --- Lifecycle Hook & Watcher ---
// Panggil fungsi saat komponen pertama kali dipasang
onMounted(() => {
  fetchPasienData(pasienId.value);
});

// Watcher untuk memuat ulang data jika ID di URL berubah (mis. navigasi)
watch(pasienId, (newId) => {
  fetchPasienData(newId);
});
</script>

<style scoped>
/* Style CSS Anda (Sama seperti yang Anda berikan) */
.pasien-detail {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  color: #333;
  text-align: center;
}

h3 {
  color: #555;
  border-bottom: 2px solid #eee;
  padding-bottom: 5px;
  margin-top: 20px;
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table th,
table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #eef;
  width: 30%;
}

.status-aktif {
  color: white;
  background-color: green;
  padding: 4px 8px;
  border-radius: 4px;
}

.status-tidak-aktif {
  color: white;
  background-color: red;
  padding: 4px 8px;
  border-radius: 4px;
}

.data-section {
  padding: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Styling for loading and error states */
.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: #fff3cd; /* Warna kuning muda untuk loading/error */
  color: #856404;
}

.error-state {
  background-color: #f8d7da; /* Warna merah muda untuk error */
  color: #721c24;
}

.not-found-state {
  text-align: center;
  padding: 40px;
  border: 2px dashed orange;
  border-radius: 8px;
  background-color: #fff8e1;
  color: #a07a00;
}
</style>
