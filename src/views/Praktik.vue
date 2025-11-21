<template>
  <div
    id="app"
    class="min-h-screen py-10 px-4 md:px-8 lg:px-12 bg-gray-100 text-gray-800"
  >
    <!-- LOADING INDICATOR -->
    <div class="max-w-4xl mx-auto mb-6 text-center">
      <transition name="fade">
        <div
          v-if="praktikStore.loading && !editingItem"
          class="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow border border-blue-200"
        >
          <svg
            class="animate-spin w-6 h-6 text-blue-500"
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
          <span class="font-medium text-blue-700 text-sm"> Memproses... </span>
        </div>
      </transition>
    </div>

    <main class="max-w-4xl mx-auto">
      <!-- BUTTON TAMBAH -->
      <div class="flex items-center justify-start mb-6">
        <button
          @click="showAddModal = true"
          class="px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <span class="text-lg">＋</span> Tambah Praktik
        </button>
      </div>

      <!-- LOADING TABLE -->
      <div
        v-if="praktikStore.loading && praktikStore.praktikList.length === 0"
        class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow border border-gray-200"
      >
        <svg
          class="animate-spin w-10 h-10 mb-4 text-blue-500"
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
        class="overflow-hidden bg-white rounded-2xl shadow border border-gray-200"
      >
        <table class="min-w-full">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs uppercase font-bold text-gray-600"
              >
                No
              </th>
              <th
                class="px-6 py-4 text-left text-xs uppercase font-bold text-gray-600"
              >
                Lokasi Praktik
              </th>
              <th
                class="px-6 py-4 text-center text-xs uppercase font-bold text-gray-600"
              >
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            <template
              v-for="(item, index) in praktikStore.praktikList"
              :key="item.id"
            >
              <tr class="hover:bg-gray-50 transition border-b">
                <td class="px-6 py-4 font-medium">{{ index + 1 }}</td>
                <td class="px-6 py-4">{{ item.lokasi_praktik || "—" }}</td>
                <td class="px-6 py-4 text-center space-x-4">
                  <button @click="startEdit(item)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5 text-blue-600 hover:text-blue-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.125 19.587a4.5 4.5 0 01-1.591 1.01l-3.06 1.02 1.02-3.06a4.5 4.5 0 011.01-1.592L16.862 3.487z"
                      />
                    </svg>
                  </button>
                  <button @click="deleteItem(item.id)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5 text-red-600 hover:text-red-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0l1-3h4l1 3"
                      />
                    </svg>
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
                        class="text-sm font-semibold text-gray-700 mb-1 block"
                      >
                        Lokasi Praktik
                      </label>
                      <input
                        v-model="editLocation"
                        type="text"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div class="flex gap-3">
                      <button
                        type="submit"
                        class="flex-1 px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        @click="cancelEdit"
                        class="flex-1 px-6 py-2.5 bg-gray-400 text-white font-semibold rounded-xl hover:bg-gray-500 transition"
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

      <!-- EMPTY -->
      <div
        v-else
        class="text-center py-20 bg-white rounded-2xl shadow border border-gray-200"
      >
        <p class="text-gray-500 text-lg">
          Belum ada praktik.
          <br />Silakan tambah lokasi praktik terlebih dahulu.
        </p>
      </div>
    </main>

    <!-- MODAL TAMBAH -->
    <PraktikAddModal
      v-if="showAddModal"
      :visible="showAddModal"
      @close="showAddModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePraktikStore } from "@/stores/praktikStore";
import PraktikAddModal from "@/components/PraktikAddModal.vue";

const praktikStore = usePraktikStore();
const showAddModal = ref(false);

const editLocation = ref("");
const editingItem = ref(null);

const startEdit = (item) => {
  editingItem.value = { ...item };
  editLocation.value = item.lokasi_praktik || "";
};

const updatePraktik = async () => {
  const payload = { lokasi_praktik: editLocation.value || null };
  const res = await praktikStore.updatePraktik(editingItem.value.id, payload);

  if (!res?.validationErrors) {
    editingItem.value = null;
  }
};

const cancelEdit = () => {
  editingItem.value = null;
  editLocation.value = "";
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
