<template>
  <div class="praktik-pasien p-4 max-w-4xl mx-auto relative">
    <!-- 🔹 Bagian kontrol atas -->
    <div
      class="controls mb-4 flex flex-col md:flex-row items-center gap-3 md:gap-4 justify-between"
    >
      <!-- Kiri: Tombol tambah -->
      <button
        @click="goToCreatePage"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition text-sm w-full md:w-auto"
      >
        ➕ Tambah Daftar Berobat Pasien
      </button>

      <!-- Tengah: Pilihan praktik -->
      <div class="flex items-center gap-3 w-full md:w-auto">
        <label for="praktik" class="whitespace-nowrap">Pilih Praktik:</label>

        <select
          id="praktik"
          v-model="store.selectedPraktikId"
          @change="store.fetchPasiens"
          class="border rounded px-3 py-2 w-full md:w-auto"
        >
          <option value="">-- Pilih praktik --</option>
          <option v-for="p in store.praktiks" :key="p.id" :value="p.id">
            {{ p.nama || p.lokasi_praktik || "Praktik " + p.id }}
          </option>
        </select>
      </div>
    </div>

    <!-- 🔸 Loading overlay -->
    <div
      v-if="store.loading"
      class="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10"
    >
      <div class="text-gray-700 font-medium italic animate-pulse">
        ⏳ memuat…
      </div>
    </div>

    <!-- 🔹 Pesan error -->
    <div v-if="store.error" class="mb-4 text-red-600">
      {{ store.error }}
    </div>

    <!-- 🔹 Info awal -->
    <div
      v-if="!store.selectedPraktikId && !store.loading"
      class="text-gray-600"
    >
      Silakan pilih praktik untuk melihat daftar pasien.
    </div>

    <!-- 🔹 Tabel data pasien -->
    <table
      v-if="store.selectedPraktikId && store.pasiens.length && !store.loading"
      class="min-w-full border-collapse shadow rounded overflow-hidden"
    >
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="px-3 py-2">ID</th>
          <th class="px-3 py-2">NIK</th>
          <th class="px-3 py-2">Nama</th>
          <th class="px-3 py-2">Tanggal Lahir</th>
          <th class="px-3 py-2">Status</th>
          <th class="px-3 py-2">Tanggal Kontrol</th>
          <th class="px-3 py-2 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="pasien in store.pasiens"
          :key="pasien.id"
          class="odd:bg-white even:bg-gray-50"
        >
          <td class="px-3 py-2">{{ pasien.id }}</td>
          <td class="px-3 py-2">{{ pasien.nik }}</td>
          <td class="px-3 py-2">{{ pasien.nama }}</td>
          <td class="px-3 py-2">{{ store.formatDate(pasien.tanggal) }}</td>
          <td class="px-3 py-2">{{ pasien.status }}</td>
          <td class="px-3 py-2">
            {{ store.formatDate(pasien.pivot?.tanggal_daftar) || "-" }}
          </td>

          <td class="px-3 py-2 text-center">
            <button
              @click="store.hapusPasien(pasien.id)"
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              🗑️ Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 🔹 Pesan kosong -->
    <div
      v-else-if="
        store.selectedPraktikId && !store.loading && !store.pasiens.length
      "
      class="text-gray-600"
    >
      Tidak ada pasien untuk praktik terpilih.
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePraktikPasienStore } from "../stores/usePraktikPasienStore";

const router = useRouter();
const store = usePraktikPasienStore();

const goToCreatePage = () => {
  router.push({ name: "CreatePraktikPasien" });
};

onMounted(() => {
  store.fetchPraktiks();
});
</script>

<style scoped>
.praktik-pasien {
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial;
}
table {
  border: 1px solid #e5e7eb;
  width: 100%;
}
th,
td {
  border-bottom: 1px solid #eef2f7;
}
</style>
