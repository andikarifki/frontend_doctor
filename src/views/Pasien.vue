<template>
  <div class="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
    <section
      class="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 md:space-x-4"
    >
      <button
        @click="goToCreatePage"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition text-sm w-full md:w-auto"
      >
        ➕ Tambah Pasien Baru
      </button>

      <input
        type="text"
        v-model="searchQuery"
        @input="searchPatientsDebounced"
        placeholder="🔍 Cari NIK atau nama pasien..."
        class="block border-gray-300 rounded-md shadow-sm p-2 text-sm border w-full md:w-1/3 max-w-md focus:ring-indigo-500 focus:border-indigo-500"
      />
    </section>

    <table class="min-w-full divide-y divide-gray-200 table-fixed">
      <thead class="bg-blue-800 text-white">
        <tr>
          <th
            class="w-[5%] px-4 py-3 text-center text-xs font-medium uppercase"
          >
            No
          </th>
          <th class="w-[20%] px-4 py-3 text-left text-xs font-medium uppercase">
            NIK
          </th>
          <th class="w-[20%] px-4 py-3 text-left text-xs font-medium uppercase">
            Nama
          </th>
          <th class="w-[15%] px-4 py-3 text-left text-xs font-medium uppercase">
            Tanggal Lahir
          </th>
          <th class="w-[15%] px-4 py-3 text-left text-xs font-medium uppercase">
            Status
          </th>
          <th
            class="w-[25%] px-4 py-3 text-center text-xs font-medium uppercase"
          >
            Aksi
          </th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="loading && !patients.length">
          <td colspan="6" class="px-4 py-4 text-center text-gray-500 italic">
            Memuat data...
          </td>
        </tr>
        <tr v-else-if="!patients.length && !loading">
          <td colspan="6" class="px-4 py-4 text-center text-gray-500 italic">
            Belum ada data pasien.
          </td>
        </tr>

        <tr
          v-for="(pasien, index) in patients"
          :key="pasien.id"
          class="hover:bg-indigo-50 transition duration-100"
        >
          <td class="px-4 py-3 text-sm text-gray-600 text-center font-medium">
            {{ index + 1 }}
          </td>
          <td class="px-4 py-3 text-sm text-gray-600 font-mono">
            {{ pasien.nik || "-" }}
          </td>
          <td class="px-4 py-3 text-sm text-gray-600">{{ pasien.nama }}</td>
          <td class="px-4 py-3 text-sm text-gray-600">
            {{ pasien.tanggal ? pasien.tanggal.substring(0, 10) : "-" }}
          </td>
          <td class="px-4 py-3">
            <span
              :class="{
                'bg-green-100 text-green-800': pasien.status === 'Aktif',
                'bg-yellow-100 text-yellow-800':
                  pasien.status === 'Tidak Aktif' ||
                  pasien.status === 'Selesai',
                'bg-red-100 text-red-800': pasien.status === 'Meninggal',
              }"
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
            >
              {{ pasien.status }}
            </span>
          </td>
          <td
            class="px-4 py-3 text-sm flex justify-center items-center space-x-2"
          >
            <button
              @click="goToDetailPage(pasien.id)"
              class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded transition flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
            <button
              @click="handleDeleteConfirmation(pasien.id, pasien.nama)"
              class="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded transition flex items-center justify-center"
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
            <button
              @click="handleWhatsapp(pasien.no_tlp)"
              class="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded transition flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="M16.002 3.2c-7.05 0-12.8 5.682-12.8 12.67c0 2.23.586 4.41 1.7 6.33L3.2 28.8l6.75-1.767a12.83 12.83 0 006.05 1.537h.003c7.05 0 12.8-5.682 12.8-12.67c0-3.39-1.323-6.576-3.726-8.963C22.675 4.512 19.44 3.2 16.002 3.2zm7.48 18.58c-.31.87-1.78 1.64-2.47 1.75c-.63.1-1.43.14-2.31-.14c-.53-.17-1.21-.39-2.08-.76c-3.66-1.59-6.04-5.28-6.22-5.53c-.18-.25-1.48-1.97-1.48-3.75c0-1.78.94-2.66 1.28-3.02c.34-.36.75-.45 1-.45h.72c.23 0 .54-.08.84.64c.31.77 1.05 2.66 1.14 2.85c.09.19.15.41.03.66c-.12.25-.18.41-.34.63c-.17.2-.36.45-.52.61c-.17.17-.34.36-.15.7c.18.34.81 1.33 1.74 2.16c1.19 1.06 2.17 1.39 2.51 1.55c.34.17.54.14.74-.08c.2-.22.86-1 1.09-1.34c.23-.34.46-.28.78-.17c.33.11 2.09.98 2.45 1.16c.36.17.6.25.69.39c.09.14.09.89-.22 1.76z"
                />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { usePasienStore } from "@/stores/pasienStore";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const store = usePasienStore();
const router = useRouter();

const { patients, loading } = storeToRefs(store);
const { deletePatient, fetchPatients } = store;

const searchQuery = ref("");
let searchTimeout = null;

const goToCreatePage = () => router.push({ name: "PasienCreate" });
const goToDetailPage = (id) =>
  router.push({ name: "DetailPasien", params: { id } });

const searchPatients = async () => {
  const query = searchQuery.value.trim();
  if (!query) {
    await fetchPatients();
    return;
  }
  try {
    store.loading = true;
    const url = `http://localhost:8000/api/pasien/search/${encodeURIComponent(
      query
    )}`;
    const res = await axios.get(url);
    store.patients = res.data.data || res.data;
  } catch (err) {
    console.error("Gagal mencari pasien:", err);
    store.patients = [];
  } finally {
    store.loading = false;
  }
};

const searchPatientsDebounced = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => searchPatients(), 300);
};

onMounted(fetchPatients);

const handleDeleteConfirmation = (id, nama) => {
  if (confirm(`[KONFIRMASI HAPUS] Hapus Pasien: ${nama} (ID: ${id})?`)) {
    deletePatient(id).then(() => fetchPatients());
  }
};

const handleWhatsapp = (number) => {
  if (!number) {
    alert("Nomor WhatsApp tidak tersedia.");
    return;
  }
  const phone = number.replace(/^0/, "62");
  const text = encodeURIComponent(
    "Halo, saya dari klinik. Ada yang perlu dikonfirmasi."
  );
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
};
</script>
