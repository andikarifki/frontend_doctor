<template>
  <div
    id="app"
    class="min-h-screen pt-8 pb-16 px-4 md:px-8 lg:px-12 bg-gray-100 text-gray-800 font-sans"
  >
    <!-- LOADING INDICATOR -->
    <div class="mb-6 max-w-6xl mx-auto text-center">
      <p
        v-if="praktikStore.loading && !editingItem"
        class="text-blue-700 font-semibold p-3 bg-white rounded-xl inline-flex items-center shadow-md border border-blue-200"
      >
        <svg
          class="animate-spin w-5 h-5 mr-3 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0l3.5 3m-3.5-3v5h.582"
          />
        </svg>
        Memproses permintaan...
      </p>
    </div>

    <main class="max-w-6xl mx-auto">
      <!-- FORM TAMBAH PRAKTIK -->
      <div
        class="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200 mb-10"
      >
        <h2 class="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3">
          Daftar Praktik Baru 🩺
        </h2>

        <form
          @submit.prevent="addPraktik"
          class="grid grid-cols-1 md:grid-cols-7 gap-5 items-end"
        >
          <div class="col-span-1 md:col-span-3">
            <label class="block text-sm font-bold text-gray-700 mb-1"
              >Lokasi Praktik (Opsional)</label
            >
            <input
              v-model="newLocation"
              type="text"
              placeholder="Contoh: RSUD Sleman atau Klinik Sehat"
              class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:border-blue-600"
            />
          </div>

          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-bold text-gray-700 mb-1"
              >Tanggal Mulai (Wajib)</label
            >
            <input
              v-model="newDate"
              type="date"
              required
              class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:border-blue-600"
            />
          </div>

          <div class="col-span-1 md:col-span-2">
            <button
              type="submit"
              :disabled="praktikStore.loading"
              class="w-full px-6 py-2.5 bg-blue-600 text-white font-extrabold rounded-xl shadow-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center"
            >
              <span v-if="praktikStore.loading" class="flex items-center">
                <svg
                  class="animate-spin w-5 h-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0l3.5 3m-3.5-3v5h.582"
                  />
                </svg>
                Menyimpan...
              </span>
              <span v-else>+ Tambah Praktik</span>
            </button>
          </div>
        </form>

        <!-- ERROR VALIDASI -->
        <transition name="fade">
          <div
            v-if="formErrors"
            class="mt-6 p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg shadow-inner"
          >
            <p class="font-bold text-lg flex items-center">
              <span class="mr-2 text-xl">🚨</span> Validasi Gagal:
            </p>
            <ul class="list-disc list-inside mt-2 ml-4 text-sm">
              <li v-for="(error, key) in formErrors" :key="key" class="mt-1">
                <span class="font-mono font-bold">{{ key }}</span
                >:
                {{ error.join(", ") }}
              </li>
            </ul>
          </div>
        </transition>
      </div>

      <!-- TABEL DAFTAR PRAKTIK -->
      <h2 class="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3">
        Daftar Semua Praktik 📅
      </h2>

      <div
        v-if="praktikStore.loading && praktikStore.praktikList.length === 0"
        class="flex flex-col items-center justify-center py-20 text-blue-600 bg-white rounded-2xl shadow-xl border border-gray-200"
      >
        <svg
          class="animate-spin w-12 h-12 mb-4 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0l3.5 3m-3.5-3v5h.582"
          />
        </svg>
        <span class="text-xl font-medium">Memuat data praktik...</span>
      </div>

      <div
        v-else-if="praktikStore.error"
        class="bg-red-100 p-6 rounded-2xl border-l-4 border-red-600 shadow-xl text-center"
      >
        <p class="font-extrabold text-red-800 text-2xl">
          ❌ Koneksi/Server Gagal!
        </p>
        <p class="text-red-700 mt-3 text-lg">
          {{ praktikStore.error }}
        </p>
      </div>

      <div
        v-else-if="praktikStore.praktikList.length"
        class="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-extrabold text-gray-600 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-extrabold text-gray-600 uppercase tracking-wider"
              >
                Lokasi Praktik
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-extrabold text-gray-600 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-extrabold text-gray-600 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in praktikStore.praktikList" :key="item.id">
              <td class="px-6 py-4 font-bold text-gray-900">#{{ item.id }}</td>
              <td class="px-6 py-4 text-gray-700">
                {{ item.lokasi_praktik || "— Belum Ditentukan" }}
              </td>
              <td class="px-6 py-4 text-blue-600 font-bold">
                {{ formatDate(item.tanggal_daftar) }}
              </td>
              <td class="px-6 py-4 space-x-3">
                <button
                  @click="startEdit(item)"
                  class="text-blue-600 hover:text-blue-800 font-bold"
                >
                  Edit
                </button>
                <button
                  @click="deleteItem(item.id)"
                  class="text-red-600 hover:text-red-800 font-bold"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-else
        class="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-xl border border-gray-200"
      >
        <p class="text-3xl font-extrabold text-gray-700 mb-2">
          👋 Belum Ada Praktik
        </p>
        <p class="mt-3 text-lg">
          Silakan gunakan formulir di atas untuk mendaftarkan praktik baru.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePraktikStore } from "@/stores/praktikStore";
import { storeToRefs } from "pinia";

const praktikStore = usePraktikStore();
const { praktikList } = storeToRefs(praktikStore);

const newDate = ref("");
const newLocation = ref("");
const formErrors = ref(null);
const editingItem = ref(null);

const formatDate = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

const addPraktik = async () => {
  const payload = {
    tanggal_daftar: newDate.value,
    lokasi_praktik: newLocation.value || null,
  };
  const res = await praktikStore.createPraktik(payload);
  if (res?.validationErrors) {
    formErrors.value = res.validationErrors;
  } else {
    newDate.value = "";
    newLocation.value = "";
    formErrors.value = null;
  }
};

const deleteItem = async (id) => {
  if (confirm(`Yakin mau hapus praktik ID #${id}?`)) {
    await praktikStore.deletePraktik(id);
  }
};

const startEdit = (item) => {
  alert(`Kamu bisa tambahkan form edit di bawah item #${item.id}`);
};

onMounted(() => {
  praktikStore.fetchPraktikList();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
