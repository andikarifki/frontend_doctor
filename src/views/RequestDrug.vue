<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Request Obat Internal</h1>

    <!-- Tombol buka modal -->
    <button
      @click="showModal = true"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
    >
      Tambah Request
    </button>

    <!-- Modal Form Request -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <button
          @click="showModal = false"
          class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        <h2 class="text-lg font-semibold mb-4">Form Request Obat</h2>

        <div class="grid grid-cols-1 gap-3">
          <div>
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
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Kirim Permintaan
        </button>
      </div>
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
import axios from "axios";

const showModal = ref(false);
const obat = ref([]);
const obat_id = ref("");
const jumlah = ref(1);
const tanggal = ref("");
const keterangan = ref("");
const riwayat = ref([]);

// Ambil stok obat
const fetchObat = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/stok-obat");
    if (res.data.success) obat.value = res.data.data;
  } catch (err) {
    console.error("Gagal mengambil stok obat:", err);
  }
};

// Ambil riwayat request
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

// Kirim request
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
      fetchRiwayat();
      // reset form & tutup modal
      obat_id.value = "";
      jumlah.value = 1;
      tanggal.value = "";
      keterangan.value = "";
      showModal.value = false;
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat mengirim permintaan");
  }
};

// Cancel request
const cancelRequest = async (id) => {
  if (!confirm("Batalkan permintaan ini?")) return;
  try {
    await axios.delete(`http://127.0.0.1:8000/api/request-obat-internal/${id}`);
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
