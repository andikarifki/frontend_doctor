<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="mb-4">
      <router-link
        to="/medicine/tambah"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Tambah Obat
      </router-link>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full border-collapse border shadow rounded">
        <thead class="bg-gray-200">
          <tr>
            <th class="border px-3 py-2">ID</th>
            <th class="border px-3 py-2">Nama Obat</th>
            <th class="border px-3 py-2">Stok</th>
            <th class="border px-3 py-2">Jenis Obat</th>
            <th class="border px-3 py-2">Kategori Obat</th>
            <th class="border px-3 py-2">Expired Date</th>
            <th class="border px-3 py-2">Harga</th>
            <th class="border px-3 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="obat in stokObat" :key="obat.id" class="hover:bg-gray-100">
            <td class="border px-3 py-2 text-center">{{ obat.id }}</td>
            <td class="border px-3 py-2">{{ obat.nama_obat }}</td>
            <td class="border px-3 py-2 text-center">{{ obat.stok }}</td>
            <td class="border px-3 py-2 text-center">{{ obat.satuan }}</td>
            <td class="border px-3 py-2">{{ obat.kategori }}</td>
            <td class="border px-3 py-2 text-center">
              {{ obat.expired_date }}
            </td>
            <td class="border px-3 py-2 text-right">{{ obat.harga }}</td>
            <td class="border px-3 py-2 text-center flex justify-center">
              <button
                @click="hapusObat(obat.id)"
                class="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded transition flex items-center justify-center"
                title="Hapus Obat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0l1-3h4l1 3"
                  />
                </svg>
              </button>
            </td>
          </tr>

          <tr v-if="stokObat.length === 0">
            <td colspan="8" class="text-center py-4 text-gray-500">
              Tidak ada data stok obat.
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

const stokObat = ref([]);

const fetchStokObat = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/stok-obat");
    if (response.data.success) {
      stokObat.value = response.data.data;
    }
  } catch (error) {
    console.error("Gagal mengambil data stok obat:", error);
  }
};

onMounted(fetchStokObat);

const hapusObat = async (id) => {
  if (!confirm("Apakah yakin ingin menghapus obat ini?")) return;

  try {
    await axios.delete(`http://127.0.0.1:8000/api/stok-obat/${id}`);
    // hapus dari frontend juga
    stokObat.value = stokObat.value.filter((o) => o.id !== id);
  } catch (error) {
    console.error("Gagal menghapus obat:", error);
    alert("Terjadi kesalahan saat menghapus obat.");
  }
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 0.5rem;
}
thead th {
  background-color: #f3f4f6;
  text-align: center;
}
button {
  cursor: pointer;
  font-size: 1.2rem;
}
</style>
