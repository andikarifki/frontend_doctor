<template>
  <div class="p-6 max-w-4xl mx-auto">
    <button
      @click="showModal = true"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
    >
      Tambah Request
    </button>

    <RequestObatModal
      :show="showModal"
      :obat="obat"
      @close="showModal = false"
      @success="fetchRiwayat"
    />

    <!-- Riwayat Permintaan -->
    <div class="bg-white p-4 shadow rounded">
      <h2 class="font-semibold mb-3 text-lg">Riwayat Permintaan Obat</h2>
      <table class="w-full border text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-2 py-1">Tanggal</th>
            <th class="border px-2 py-1">Obat</th>
            <th class="border px-2 py-1">Jumlah</th>
            <th class="border px-2 py-1">Keterangan</th>
            <th class="border px-2 py-1">Status</th>
            <th class="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in riwayat" :key="r.id">
            <td class="border px-2 py-1">{{ r.tanggal }}</td>
            <td class="border px-2 py-1">{{ r.nama_obat }}</td>
            <td class="border px-2 py-1">{{ r.jumlah }}</td>
            <td class="border px-2 py-1">{{ r.keterangan || "-" }}</td>
            <td
              class="border px-2 py-1 font-semibold"
              :class="warnaStatus(r.status)"
            >
              {{ r.status.toUpperCase() }}
            </td>
            <td class="border px-2 py-1 text-center">
              <button
                v-if="r.status === 'pending'"
                @click="cancelRequest(r.id)"
                class="text-red-600 hover:underline"
                title="Cancel Request"
              >
                ✕
              </button>
            </td>
          </tr>
          <tr v-if="riwayat.length === 0">
            <td colspan="6" class="text-center py-3 text-gray-500">
              Riwayat kosong.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";
import RequestObatModal from "./RequestObatModal.vue";

const showModal = ref(false);
const obat = ref([]);
const riwayat = ref([]);

// Ambil stok obat
const fetchObat = async () => {
  try {
    const res = await api.get("/stok-obat");
    if (res.data.success) obat.value = res.data.data;
  } catch (err) {
    console.error("Gagal mengambil stok obat:", err);
  }
};

// Ambil riwayat request
const fetchRiwayat = async () => {
  try {
    const res = await api.get("/request-obat-internal");
    if (res.data.success) {
      riwayat.value = res.data.data.map((r) => ({
        ...r,
        status: r.status.toLowerCase(),
      }));
    }
  } catch (err) {
    console.error("Gagal mengambil riwayat:", err);
  }
};

onMounted(() => {
  fetchObat();
  fetchRiwayat();
});

// Cancel request
const cancelRequest = async (id) => {
  if (!confirm("Batalkan permintaan ini?")) return;
  try {
    await api.delete(`/request-obat-internal/${id}`);
    riwayat.value = riwayat.value.filter((r) => r.id !== id);
  } catch (err) {
    console.error(err);
    alert("Gagal membatalkan permintaan");
  }
};

// Warna status
const warnaStatus = (status) =>
  ({
    approved: "text-green-600",
    pending: "text-yellow-600",
    rejected: "text-red-600",
  }[status]);
</script>
