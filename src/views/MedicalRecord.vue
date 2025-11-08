<template>
  <div class="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg">
    <div class="mb-4">
      <label for="pasien" class="block text-sm font-medium text-gray-600 mb-1">
        Pilih Pasien
      </label>
      <select
        id="pasien"
        v-model="selectedPasienId"
        @change="fetchMedicalRecords"
        class="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-300"
      >
        <option disabled value="">-- Pilih Pasien --</option>
        <option
          v-for="pasien in pasienList"
          :key="pasien.id"
          :value="pasien.id"
        >
          {{ pasien.nama }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-6 text-gray-500">
      Memuat data rekam medis...
    </div>

    <!-- Tabel data rekam medis -->
    <div v-else>
      <table
        v-if="records.length"
        class="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden"
      >
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="p-2 border">Tanggal</th>
            <th class="p-2 border">Diagnosis</th>
            <th class="p-2 border">Obat</th>
            <th class="p-2 border">Lokasi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in records"
            :key="record.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="p-2 border text-center">
              {{ formatDate(record.tanggal_periksa) }}
            </td>
            <td class="p-2 border">{{ record.diagnosis }}</td>
            <td class="p-2 border">{{ record.obat }}</td>
            <td class="p-2 border">{{ record.lokasi_berobat || "-" }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Jika tidak ada data -->
      <p v-else class="text-gray-500 text-center py-6">
        Tidak ada rekam medis untuk pasien ini.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const pasienList = ref([]);
const selectedPasienId = ref("");
const records = ref([]);
const loading = ref(false);

// Base URL API Laravel
const API_BASE = "http://127.0.0.1:8000/api";

// Ambil daftar pasien saat halaman dimuat
const fetchPasiens = async () => {
  try {
    const res = await axios.get(`${API_BASE}/pasien`);
    pasienList.value = res.data.data;
  } catch (error) {
    console.error("Gagal memuat pasien:", error);
  }
};

// Ambil rekam medis berdasarkan pasien
const fetchMedicalRecords = async () => {
  if (!selectedPasienId.value) return;
  loading.value = true;
  records.value = [];

  try {
    const res = await axios.get(
      `${API_BASE}/pasien/${selectedPasienId.value}/medical-records`
    );
    records.value = res.data.data;
  } catch (error) {
    console.error("Gagal memuat rekam medis:", error);
  } finally {
    loading.value = false;
  }
};

// Format tanggal agar lebih rapi
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(fetchPasiens);
</script>
