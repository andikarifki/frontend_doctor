<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Daftar Permintaan Obat Internal</h1>

    <div class="overflow-x-auto bg-white p-4 shadow rounded">
      <table class="w-full border-collapse border">
        <thead class="bg-gray-200">
          <tr>
            <th class="border px-3 py-2">Tanggal</th>
            <th class="border px-3 py-2">Obat</th>
            <th class="border px-3 py-2">Jumlah</th>
            <th class="border px-3 py-2">Keterangan</th>
            <th class="border px-3 py-2">Status</th>
            <th class="border px-3 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in requests" :key="r.id" class="hover:bg-gray-50">
            <td class="border px-3 py-2">{{ r.tanggal }}</td>
            <td class="border px-3 py-2">{{ r.nama_obat }}</td>
            <td class="border px-3 py-2 text-center">{{ r.jumlah }}</td>
            <td class="border px-3 py-2">{{ r.keterangan || "-" }}</td>
            <td
              class="border px-3 py-2 font-semibold"
              :class="warnaStatus(r.status)"
            >
              {{ r.status.toUpperCase() }}
            </td>
            <td class="border px-3 py-2 text-center">
              <button
                v-if="r.status === 'pending'"
                @click="approveRequest(r.id)"
                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-1"
              >
                Approve
              </button>
              <button
                v-if="r.status === 'pending'"
                @click="rejectRequest(r.id)"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </td>
          </tr>
          <tr v-if="requests.length === 0">
            <td colspan="6" class="text-center py-3 text-gray-500">
              Belum ada permintaan.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios"; // instance Axios dengan baseURL

const requests = ref([]);

const fetchRequests = async () => {
  try {
    const res = await api.get("/request-obat-internal");
    if (res.data.success) requests.value = res.data.data;
  } catch (err) {
    console.error("Gagal mengambil request:", err);
  }
};

const approveRequest = async (id) => {
  if (!confirm("Setujui permintaan ini?")) return;
  try {
    await api.patch(`/request-obat-internal/${id}/approve`);
    const r = requests.value.find((r) => r.id === id);
    if (r) r.status = "approved";
    alert("Permintaan disetujui dan stok dikurangi");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Gagal approve permintaan");
  }
};

const rejectRequest = async (id) => {
  if (!confirm("Tolak permintaan ini?")) return;
  try {
    await api.patch(`/request-obat-internal/${id}/reject`);
    const r = requests.value.find((r) => r.id === id);
    if (r) r.status = "rejected";
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Gagal reject permintaan");
  }
};

const warnaStatus = (status) =>
  ({
    approved: "text-green-600",
    pending: "text-yellow-600",
    rejected: "text-red-600",
  }[status]);

onMounted(fetchRequests);
</script>
