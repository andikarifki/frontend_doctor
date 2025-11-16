<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Form Request Obat -->
    <div class="bg-white p-4 shadow rounded mb-6">
      <h2 class="font-semibold mb-3">Request Obat Internal</h2>
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-2">
          <label class="block mb-1">Pilih Obat</label>
          <select v-model="obat_id" class="border rounded w-full px-2 py-1">
            <option value="">-- Pilih Obat --</option>
            <option v-for="o in obat" :key="o.id" :value="o.id">
              {{ o.nama_obat }} (stok: {{ o.stok }})
            </option>
          </select>
        </div>
        <div>
          <label class="block mb-1">Jumlah</label>
          <input
            type="number"
            v-model.number="jumlah"
            min="1"
            class="border rounded w-full px-2 py-1"
          />
        </div>
      </div>

      <div class="mt-3 grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1">Tanggal (Opsional)</label>
          <input
            type="date"
            v-model="tanggal"
            class="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label class="block mb-1">Keterangan (Opsional)</label>
          <input
            type="text"
            v-model="keterangan"
            class="border rounded w-full px-2 py-1"
            placeholder="Catatan tambahan"
          />
        </div>
      </div>

      <button
        @click="kirimRequest"
        class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Kirim Permintaan
      </button>
    </div>

    <!-- Riwayat Permintaan -->
    <div class="bg-white p-4 shadow rounded">
      <h2 class="font-semibold mb-3">Riwayat Permintaan</h2>
      <table class="w-full border">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-2 py-1">Tanggal</th>
            <th class="border px-2 py-1">Obat</th>
            <th class="border px-2 py-1">Jumlah</th>
            <th class="border px-2 py-1">Keterangan</th>
            <th class="border px-2 py-1">Status</th>
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
          </tr>
          <tr v-if="riwayat.length === 0">
            <td colspan="5" class="text-center py-3 text-gray-500">
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
import axios from "axios";

const obat = ref([]);
const obat_id = ref("");
const jumlah = ref(1);
const tanggal = ref("");
const keterangan = ref("");
const riwayat = ref([]);

// Fetch stok obat dari API
const fetchObat = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/stok-obat");
    if (res.data.success) obat.value = res.data.data;
  } catch (err) {
    console.error("Gagal mengambil stok obat:", err);
  }
};

// Fetch riwayat request dari API
const fetchRiwayat = async () => {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/request-obat-internal"
    );
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

// Kirim request obat
const kirimRequest = async () => {
  if (!obat_id.value || jumlah.value < 1)
    return alert("Pilih obat dan jumlah minimal 1");

  const payload = {
    obat_id: obat_id.value,
    jumlah: jumlah.value,
    tanggal: tanggal.value || null,
    keterangan: keterangan.value || null,
  };

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/request-obat-internal",
      payload
    );
    if (res.data.success) {
      alert("Permintaan berhasil dikirim");
      fetchRiwayat(); // update riwayat dari backend
      // reset form
      obat_id.value = "";
      jumlah.value = 1;
      tanggal.value = "";
      keterangan.value = "";
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat mengirim permintaan");
  }
};

// Fungsi warna status
const warnaStatus = (status) =>
  ({
    approved: "text-green-600",
    pending: "text-yellow-600",
    rejected: "text-red-600",
  }[status]);
</script>
