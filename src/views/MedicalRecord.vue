<template>
  <div class="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg">
    <!-- Pilih Pasien -->
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
        <option v-for="p in pasienList" :key="p.id" :value="p.id">
          {{ p.nama }}
        </option>
      </select>
    </div>

    <!-- Button Tambah Rekam Medis -->
    <div v-if="selectedPasienId" class="mb-4">
      <button
        @click="showForm = true"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Tambah Rekam Medis
      </button>
    </div>

    <!-- Form Tambah Rekam Medis -->
    <div v-if="showForm" class="p-4 mb-6 border rounded bg-gray-50">
      <h3 class="text-lg font-medium mb-2">Form Riwayat Medis</h3>
      <form @submit.prevent="tambahRecord" class="space-y-3">
        <div>
          <label class="block mb-1">Tanggal Periksa</label>
          <input
            type="date"
            v-model="form.tanggal_periksa"
            required
            class="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label class="block mb-1">Diagnosis</label>
          <input
            type="text"
            v-model="form.diagnosis"
            required
            class="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label class="block mb-1">Obat</label>
          <input
            type="text"
            v-model="form.obat"
            required
            class="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label class="block mb-1">Praktik</label>
          <select
            v-model="form.praktik_id"
            required
            class="border p-2 rounded w-full"
          >
            <option disabled value="">-- Pilih Praktik --</option>
            <option v-for="p in daftarPraktik" :key="p.id" :value="p.id">
              {{ p.lokasi_praktik }}
            </option>
          </select>
        </div>
        <div class="flex space-x-2">
          <button
            type="submit"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Simpan
          </button>
          <button
            type="button"
            @click="showForm = false"
            class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Batal
          </button>
        </div>
      </form>
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
            <th class="p-2 border">Tanggal Periksa</th>
            <th class="p-2 border">Diagnosis</th>
            <th class="p-2 border">Obat</th>
            <th class="p-2 border">Lokasi</th>
            <th class="p-2 border">Aksi</th>
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
            <td class="p-2 border text-center">
              <button
                @click="hapusRecord(record.id)"
                class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

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
const daftarPraktik = ref([]);
const showForm = ref(false);
const loading = ref(false);

const form = ref({
  tanggal_periksa: "",
  diagnosis: "",
  obat: "",
  praktik_id: "",
});

const API_BASE = "http://127.0.0.1:8000/api";

// Ambil daftar pasien
const fetchPasiens = async () => {
  try {
    const res = await axios.get(`${API_BASE}/pasien`);
    pasienList.value = res.data.data || [];
  } catch (err) {
    console.error("Gagal memuat pasien:", err);
  }
};

// Ambil daftar praktik
const fetchDaftarPraktik = async () => {
  try {
    const res = await axios.get(`${API_BASE}/pendaftaran-praktik`);
    daftarPraktik.value = res.data.data || [];
  } catch (err) {
    console.error("Gagal memuat praktik:", err);
  }
};

// Ambil rekam medis pasien
const fetchMedicalRecords = async () => {
  if (!selectedPasienId.value) return;
  loading.value = true;
  records.value = [];
  try {
    const res = await axios.get(
      `${API_BASE}/pasien/${selectedPasienId.value}/medical-records`
    );
    records.value = res.data.data || [];
  } catch (err) {
    console.error("Gagal memuat rekam medis:", err);
  } finally {
    loading.value = false;
  }
};

// Tambah rekam medis
const tambahRecord = async () => {
  try {
    const payload = {
      pasien_id: selectedPasienId.value,
      ...form.value,
    };
    const res = await axios.post(`${API_BASE}/medical-records`, payload);
    if (res.data.success) {
      showForm.value = false;
      form.value = {
        tanggal_periksa: "",
        diagnosis: "",
        obat: "",
        praktik_id: "",
      };
      fetchMedicalRecords();
      alert("Riwayat medis berhasil ditambahkan!");
    }
  } catch (err) {
    console.error(err);
    alert("Gagal menambahkan riwayat medis.");
  }
};

// Hapus rekam medis
const hapusRecord = async (id) => {
  if (!confirm("Apakah yakin ingin menghapus rekam medis ini?")) return;
  try {
    await axios.delete(`${API_BASE}/medical-records/${id}`);
    alert("Rekam medis berhasil dihapus!");
    fetchMedicalRecords();
  } catch (err) {
    console.error(err);
    alert("Gagal menghapus rekam medis.");
  }
};

onMounted(() => {
  fetchPasiens();
  fetchDaftarPraktik();
});

const formatDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
</script>
