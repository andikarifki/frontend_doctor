<template>
  <div
    id="app"
    class="min-h-screen py-10 px-4 md:px-8 lg:px-12 bg-gray-100 text-gray-800"
  >
    <!-- LOADING INDICATOR -->
    <div class="max-w-5xl mx-auto mb-6 text-center">
      <transition name="fade">
        <div
          v-if="praktikStore.loading && !editingItem"
          class="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow border border-blue-200"
        >
          <svg
            class="animate-spin w-5 h-5 text-blue-500"
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
          <span class="font-medium text-blue-700">
            Memproses permintaan...
          </span>
        </div>
      </transition>
    </div>

    <main class="max-w-5xl mx-auto">
      <!-- FORM TAMBAH PRAKTIK -->
      <section
        class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-12"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          Tambah Lokasi Praktik 🩺
        </h2>

        <form
          @submit.prevent="addPraktik"
          class="grid grid-cols-1 md:grid-cols-4 gap-5 items-end"
        >
          <div class="md:col-span-3">
            <label class="text-sm font-semibold text-gray-700 mb-2 block"
              >Lokasi Praktik</label
            >
            <input
              v-model="newLocation"
              type="text"
              placeholder="Contoh: Klinik Harapan Sehat"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            type="submit"
            :disabled="praktikStore.loading"
            class="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            <span
              v-if="praktikStore.loading"
              class="flex items-center justify-center gap-2"
            >
              <svg
                class="animate-spin w-5 h-5"
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
            <span v-else>Tambah</span>
          </button>
        </form>

        <!-- ERROR BOX -->
        <transition name="fade">
          <div
            v-if="formErrors"
            class="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
          >
            <p class="font-semibold text-red-700">Validasi gagal:</p>
            <ul class="mt-2 ml-4 list-disc text-red-600 text-sm">
              <li v-for="(error, key) in formErrors" :key="key">
                <span class="font-bold">{{ key }}</span
                >:
                {{ error.join(", ") }}
              </li>
            </ul>
          </div>
        </transition>
      </section>

      <!-- TABEL -->
      <h2 class="text-2xl font-bold text-gray-800 mb-5">Daftar Praktik 📅</h2>

      <!-- LOADING TABLE -->
      <div
        v-if="praktikStore.loading && praktikStore.praktikList.length === 0"
        class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200"
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
        <span class="text-lg text-blue-700">Memuat data...</span>
      </div>

      <!-- ERROR -->
      <div
        v-else-if="praktikStore.error"
        class="bg-red-50 p-8 rounded-2xl border-l-4 border-red-500 text-center shadow-sm"
      >
        <h3 class="text-xl font-bold text-red-700">Koneksi gagal</h3>
        <p class="text-red-600 mt-2">{{ praktikStore.error }}</p>
      </div>

      <!-- TABEL LIST -->
      <div
        v-else-if="praktikStore.praktikList.length"
        class="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200"
      >
        <table class="min-w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs uppercase font-bold text-gray-600"
              >
                No
              </th>
              <th
                class="px-6 py-4 text-left text-xs uppercase font-bold text-gray-600"
              >
                Lokasi
              </th>
              <th
                class="px-6 py-4 text-left text-xs uppercase font-bold text-gray-600"
              >
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            <template v-for="(item, index) in praktikStore.praktikList">
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 font-medium">{{ index + 1 }}</td>
                <td class="px-6 py-4">{{ item.lokasi_praktik || "—" }}</td>
                <td class="px-6 py-4 space-x-4">
                  <button
                    @click="startEdit(item)"
                    class="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteItem(item.id)"
                    class="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Hapus
                  </button>
                </td>
              </tr>

              <!-- FORM EDIT -->
              <tr
                v-if="editingItem && editingItem.id === item.id"
                class="bg-blue-50"
              >
                <td colspan="3" class="p-6">
                  <form
                    @submit.prevent="updatePraktik"
                    class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                  >
                    <div class="md:col-span-3">
                      <label
                        class="text-sm font-semibold text-gray-700 mb-2 block"
                        >Lokasi Praktik</label
                      >
                      <input
                        v-model="editLocation"
                        type="text"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div class="flex gap-3">
                      <button
                        type="submit"
                        class="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        @click="cancelEdit"
                        class="flex-1 px-6 py-3 bg-gray-400 text-white font-bold rounded-xl hover:bg-gray-500"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- EMPTY STATE -->
      <div
        v-else
        class="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200"
      >
        <h3 class="text-xl font-bold text-gray-700">Belum ada praktik</h3>
        <p class="text-gray-500 mt-2">
          Silakan tambah praktik terlebih dahulu.
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

const newLocation = ref("");
const editLocation = ref("");
const formErrors = ref(null);
const editingItem = ref(null);

const addPraktik = async () => {
  const payload = {
    lokasi_praktik: newLocation.value || null,
  };
  const res = await praktikStore.createPraktik(payload);

  if (res?.validationErrors) {
    formErrors.value = res.validationErrors;
  } else {
    newLocation.value = "";
    formErrors.value = null;
  }
};

const startEdit = (item) => {
  editingItem.value = { ...item };
  editLocation.value = item.lokasi_praktik || "";
};

const updatePraktik = async () => {
  if (!editingItem.value) return;

  const payload = {
    lokasi_praktik: editLocation.value || null,
  };

  const res = await praktikStore.updatePraktik(editingItem.value.id, payload);

  if (res?.validationErrors) {
    formErrors.value = res.validationErrors;
  } else {
    editingItem.value = null;
    formErrors.value = null;
  }
};

const cancelEdit = () => {
  editingItem.value = null;
  editLocation.value = "";
  formErrors.value = null;
};

const deleteItem = async (id) => {
  if (confirm(`Yakin mau hapus praktik ID #${id}?`)) {
    await praktikStore.deletePraktik(id);
  }
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
