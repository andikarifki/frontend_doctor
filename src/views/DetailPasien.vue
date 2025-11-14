<template>
  <div
    class="pasien-detail p-6 max-w-5xl mx-auto bg-white shadow-xl rounded-2xl mt-8"
  >
    <!-- LOADING STATE -->
    <div v-if="isLoading" class="text-center py-10 text-gray-600 animate-pulse">
      <h3 class="text-lg font-semibold">
        Memuat data pasien ID: {{ pasienId }}... ⏳
      </h3>
    </div>

    <!-- ERROR STATE -->
    <div v-else-if="error" class="text-center py-10 text-red-600">
      <h3 class="text-xl font-bold">Gagal memuat data 🚨</h3>
      <p class="mt-2">{{ error }}</p>
    </div>

    <!-- NOT FOUND STATE -->
    <div v-else-if="!pasien.id" class="text-center py-10 text-gray-700">
      <h3 class="text-xl font-semibold">
        Data Pasien ID: {{ pasienId }} Tidak Ditemukan 🚫
      </h3>
    </div>

    <!-- DATA PASIEN -->
    <div v-else class="space-y-8">
      <!-- HEADER -->
      <div class="border-b pb-4">
        <h2 class="text-2xl font-bold text-blue-800">
          Detail Pasien: {{ pasien.nama }}
        </h2>
        <p class="text-gray-600">ID Pasien: {{ pasien.id }}</p>
      </div>

      <!-- INFORMASI DASAR -->
      <section>
        <h3 class="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">
          🧾 Informasi Dasar
        </h3>
        <table class="w-full border border-gray-200 rounded-lg overflow-hidden">
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="(value, key) in basicInfo"
              :key="key"
              class="hover:bg-gray-50"
            >
              <th
                class="w-1/3 text-left bg-gray-100 px-4 py-2 font-medium text-gray-700 capitalize"
              >
                {{ key }}
              </th>
              <td class="px-4 py-2 text-gray-800">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- DAFTAR PRAKTIK -->
      <section>
        <h3 class="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">
          🏥 Tempat Periksa
        </h3>

        <div v-if="pasien.praktiks && pasien.praktiks.length > 0">
          <table
            class="w-full border border-gray-200 rounded-lg overflow-hidden"
          >
            <thead class="bg-blue-100">
              <tr>
                <th class="px-4 py-2 text-left">Lokasi</th>
                <th class="px-4 py-2 text-left">Tanggal Daftar Kontrol</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="praktik in pasien.praktiks"
                :key="praktik.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-2">{{ praktik.lokasi_praktik }}</td>
                <td class="px-4 py-2">
                  {{ formatDate(praktik.pivot?.tanggal_daftar) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-gray-600 italic mt-2">
          Pasien ini belum terdaftar di praktik manapun.
        </p>
      </section>

      <!-- CATATAN MEDIS -->
      <section>
        <h3 class="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">
          💊 Catatan Medis
        </h3>

        <div v-if="pasien.medical_records && pasien.medical_records.length > 0">
          <table
            class="w-full border border-gray-200 rounded-lg overflow-hidden"
          >
            <thead class="bg-green-100">
              <tr>
                <th class="px-4 py-2 text-left">Tanggal Kontrol</th>
                <th class="px-4 py-2 text-left">Tempat Berobat Pasien</th>
                <th class="px-4 py-2 text-left">Diagnosis</th>
                <th class="px-4 py-2 text-left">Obat</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="record in pasien.medical_records"
                :key="record.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-2">
                  {{ formatDate(record.tanggal_periksa) }}
                </td>
                <td class="px-4 py-2">
                  {{ record.praktik?.lokasi_praktik || "-" }}
                </td>
                <td class="px-4 py-2">{{ record.diagnosis }}</td>
                <td class="px-4 py-2">{{ record.obat }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-gray-600 italic mt-2">
          Belum ada catatan medis untuk pasien ini.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const pasien = ref({});
const isLoading = ref(true);
const error = ref(null);

const pasienId = computed(() => route.params.id);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Map tampilan info dasar
const basicInfo = computed(() => ({
  ID: pasien.value.id || "-",
  NIK: pasien.value.nik || "-",
  Nama: pasien.value.nama || "-",
  "Tanggal Lahir": formatDate(pasien.value.tanggal),
  Status: pasien.value.status || "-",
}));

const fetchPasienData = async (id) => {
  if (!id) {
    isLoading.value = false;
    error.value = "ID Pasien tidak ditemukan di URL.";
    return;
  }

  isLoading.value = true;
  error.value = null;
  pasien.value = {};

  const API_URL = `http://127.0.0.1:8000/api/pasien/show/${id}`;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Gagal memuat data pasien.");
    }

    pasien.value = data.data;
  } catch (err) {
    console.error("Error fetching pasien data:", err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchPasienData(pasienId.value));
watch(pasienId, (newId) => fetchPasienData(newId));
</script>
