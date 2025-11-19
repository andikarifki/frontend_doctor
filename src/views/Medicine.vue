<template>
  <div class="p-6 max-w-5xl mx-auto">
    <!-- Tombol Tambah Obat -->
    <div class="mb-4">
      <router-link
        to="/medicine/tambah"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Tambah Obat
      </router-link>
    </div>

    <!-- Tabel -->
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
          <!-- Loading -->
          <tr v-if="obatStore.loading">
            <td colspan="8" class="text-center py-4 text-gray-500">
              Memuat data...
            </td>
          </tr>

          <!-- Data -->
          <tr
            v-for="obat in obatStore.stokObat"
            :key="obat.id"
            class="hover:bg-gray-100"
          >
            <td class="border px-3 py-2 text-center">{{ obat.id }}</td>
            <td class="border px-3 py-2">{{ obat.nama_obat }}</td>
            <td class="border px-3 py-2 text-center">{{ obat.stok }}</td>
            <td class="border px-3 py-2 text-center">{{ obat.satuan }}</td>
            <td class="border px-3 py-2">{{ obat.kategori }}</td>
            <td class="border px-3 py-2 text-center">
              {{ obat.expired_date }}
            </td>
            <td class="border px-3 py-2 text-left">
              Rp {{ Number(obat.harga).toLocaleString("id-ID") }}
            </td>

            <td class="border px-3 py-2 text-center flex justify-center">
              <button
                @click="hapus(obat.id)"
                class="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded flex items-center justify-center"
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

          <!-- Jika kosong -->
          <tr v-if="!obatStore.loading && obatStore.stokObat.length === 0">
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
import { onMounted } from "vue";
import { useObatStore } from "../stores/useObatStore";

const obatStore = useObatStore();

onMounted(() => {
  obatStore.fetchStokObat();
});

const hapus = async (id) => {
  if (!confirm("Apakah yakin ingin menghapus obat ini?")) return;

  try {
    await obatStore.hapusObat(id);
  } catch (error) {
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
}
</style>
