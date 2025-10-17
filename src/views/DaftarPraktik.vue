<template>
  <div
    id="app"
    class="min-h-screen pt-4 md:pt-6 px-4 md:px-12 bg-gray-50 text-gray-800 font-sans"
  >
    <div class="mb-4 max-w-5xl mx-auto">
      <div class="text-center">
        <p
          v-if="loading && !editingItem"
          class="text-blue-600 font-medium p-2 bg-white rounded-lg inline-block shadow-sm border border-blue-200"
        >
          <svg
            class="animate-spin w-5 h-5 mr-2 inline-block text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0l3.5 3m-3.5-3v5h.582"
            />
          </svg>
          Memproses permintaan...
        </p>
      </div>
    </div>

    <main class="max-w-5xl mx-auto">
      <div
        class="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 mb-8"
      >
        <h2 class="text-3xl font-bold text-gray-800 mb-6 pb-2">
          Daftar Praktik Baru ✍️
        </h2>
        <form
          @submit.prevent="createRegistration"
          class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div class="col-span-1 md:col-span-2">
            <label
              for="new_location"
              class="block text-sm font-semibold text-gray-600 mb-1"
              >Lokasi Praktik (Opsional)</label
            >
            <input
              type="text"
              id="new_location"
              v-model="newLocation"
              placeholder="Contoh: RSUD Sleman"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition duration-200 bg-white"
            />
          </div>

          <div class="col-span-1 md:col-span-1">
            <label
              for="new_date"
              class="block text-sm font-semibold text-gray-600 mb-1"
              >Tanggal Mulai (Wajib)</label
            >
            <input
              type="date"
              id="new_date"
              v-model="newDate"
              required
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition duration-200 bg-white"
            />
          </div>

          <div class="col-span-1 md:col-span-1">
            <button
              type="submit"
              :disabled="loading"
              class="w-full px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center"
            >
              <span v-if="loading" class="flex items-center">
                <svg
                  class="animate-spin w-5 h-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0l3.5 3m-3.5-3v5h.582"
                  />
                </svg>
                Menyimpan...
              </span>
              <span v-else>+ Tambah Praktik</span>
            </button>
          </div>
        </form>

        <transition name="fade">
          <div
            v-if="formErrors"
            class="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md"
          >
            <p class="font-bold text-lg">⚠️ Validasi Gagal:</p>
            <ul class="list-disc list-inside mt-2 ml-4 text-sm">
              <li v-for="(error, key) in formErrors" :key="key">
                <span class="font-mono font-semibold">{{ key }}</span
                >:
                {{ error.join(", ") }}
              </li>
            </ul>
          </div>
        </transition>
      </div>

      <h2 class="text-3xl font-bold text-gray-800 mb-6 pb-2">
        Daftar Semua Praktik 📅
      </h2>

      <div
        v-if="loading && registrations.length === 0"
        class="flex flex-col items-center justify-center py-20 text-blue-600 bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <svg
          class="animate-spin w-10 h-10 mb-3 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0l3.5 3m-3.5-3v5h.582"
          />
        </svg>
        <span class="text-xl font-medium">Memuat data praktik...</span>
      </div>

      <div
        v-else-if="error"
        class="bg-red-50 p-6 rounded-xl border-l-4 border-red-500 shadow-lg text-center"
      >
        <p class="font-bold text-red-700 text-xl">🚨 Koneksi/Server Gagal!</p>
        <p class="text-red-600 mt-2">
          Gagal mengambil data. Pastikan **Backend Laravel** berjalan di
          <code class="font-mono text-base font-semibold bg-red-100 p-1 rounded"
            >http://127.0.0.1:8000</code
          >.
        </p>
        <p class="text-sm mt-3 text-red-500 italic">
          Detail Error: {{ error }}
        </p>
      </div>

      <div
        v-else-if="registrations.length"
        class="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Lokasi Praktik
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Jadwal Praktik
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <template v-for="item in registrations" :key="item.id">
              <tr
                :class="{
                  'bg-yellow-50 hover:bg-yellow-100/70 transition duration-150':
                    editingItem && editingItem.id === item.id,
                  'hover:bg-gray-50 transition duration-150': !(
                    editingItem && editingItem.id === item.id
                  ),
                }"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ item.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ item.lokasi_praktik || "— Belum Ditentukan" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <span class="font-medium text-blue-600">{{
                    formatDate(item.tanggal_daftar)
                  }}</span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium"
                >
                  <button
                    @click="startEdit(item)"
                    :disabled="
                      loading || (editingItem && editingItem.id !== item.id)
                    "
                    class="text-blue-600 hover:text-blue-800 font-semibold mr-4 transition duration-150 disabled:text-gray-400"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteRegistration(item.id)"
                    :disabled="
                      loading || (editingItem && editingItem.id !== item.id)
                    "
                    class="text-red-600 hover:text-red-800 font-semibold transition duration-150 disabled:text-gray-400"
                  >
                    Hapus
                  </button>
                </td>
              </tr>

              <tr
                v-if="editingItem && editingItem.id === item.id"
                class="bg-yellow-100 border-t border-yellow-300"
              >
                <td colspan="4" class="p-4 md:p-6">
                  <h4
                    class="text-xl font-bold text-yellow-800 mb-4 border-b pb-2 border-yellow-200"
                  >
                    Perbarui Data #{{ item.id }}
                  </h4>
                  <form
                    @submit.prevent="updateRegistration"
                    class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                  >
                    <div class="col-span-1 md:col-span-2">
                      <label
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Lokasi</label
                      >
                      <input
                        type="text"
                        v-model="editingItem.lokasi_praktik"
                        placeholder="Lokasi praktik baru"
                        class="w-full px-4 py-2 border-2 border-yellow-400 rounded-lg focus:border-yellow-600 focus:ring-yellow-600 transition duration-150 bg-white"
                      />
                    </div>
                    <div class="col-span-1 md:col-span-1">
                      <label
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Tanggal</label
                      >
                      <input
                        type="date"
                        v-model="editingItem.tanggal_daftar"
                        required
                        class="w-full px-4 py-2 border-2 border-yellow-400 rounded-lg focus:border-yellow-600 focus:ring-yellow-600 transition duration-150 bg-white"
                      />
                    </div>
                    <div class="col-span-1 md:col-span-1 flex space-x-3">
                      <button
                        type="submit"
                        :disabled="loading"
                        class="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        @click="cancelEdit"
                        :disabled="loading"
                        class="flex-1 px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition duration-200 disabled:bg-gray-300"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                  <transition name="fade">
                    <div
                      v-if="editErrors"
                      class="mt-4 p-3 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-md text-sm"
                    >
                      <p class="font-bold">⚠️ Validasi Update Gagal:</p>
                      <ul class="list-disc list-inside ml-4 mt-1">
                        <li v-for="(error, key) in editErrors" :key="key">
                          <span class="font-mono font-semibold">{{ key }}</span
                          >:
                          {{ error.join(", ") }}
                        </li>
                      </ul>
                    </div>
                  </transition>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div
        v-else
        class="text-center py-20 text-gray-500 bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <p class="text-2xl font-bold text-gray-700">
          Belum ada pendaftaran yang tercatat.
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

const API_URL = "http://127.0.0.1:8000/api/pendaftaran-praktik";

// State
const registrations = ref([]);
const newDate = ref("");
const newLocation = ref("");
const loading = ref(false);
const error = ref(null);
const formErrors = ref(null);
const editErrors = ref(null);
const editingItem = ref(null);

// Methods
const getAuthHeaders = () => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

const formatDate = (dateString) => {
  // Format menjadi DD/MM/YYYY
  if (!dateString) return "";
  const date = dateString.split("T")[0];
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const fetchRegistrations = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    registrations.value = await response.json();
  } catch (err) {
    console.error("Fetch Error:", err);
    error.value = "Gagal terhubung ke API. Pastikan server aktif.";
  } finally {
    loading.value = false;
  }
};

const createRegistration = async () => {
  if (!newDate.value) {
    alert("Tanggal mulai praktik wajib diisi!");
    return;
  }
  loading.value = true;
  formErrors.value = null;
  const data = {
    tanggal_daftar: newDate.value,
    lokasi_praktik: newLocation.value || null,
  };
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 422 && result.errors) {
        formErrors.value = result.errors;
      } else {
        throw new Error(result.message || "Gagal menyimpan data.");
      }
    } else {
      // Clear form and reload data
      newDate.value = "";
      newLocation.value = "";
      formErrors.value = null;
      await fetchRegistrations();
    }
  } catch (err) {
    console.error("Create Error:", err);
    error.value = "Gagal mengirim data.";
  } finally {
    loading.value = false;
  }
};

const startEdit = (item) => {
  // Reset any pending edit state
  cancelEdit();
  // Deep copy the item for editing
  editingItem.value = JSON.parse(JSON.stringify(item));
  // Format date back to YYYY-MM-DD for the input type="date"
  editingItem.value.tanggal_daftar = item.tanggal_daftar.split("T")[0];
  editErrors.value = null;
};

const cancelEdit = () => {
  editingItem.value = null;
  editErrors.value = null;
};

const updateRegistration = async () => {
  loading.value = true;
  editErrors.value = null;
  const id = editingItem.value.id;
  const url = `${API_URL}/${id}`;

  const data = {
    lokasi_praktik: editingItem.value.lokasi_praktik || null,
    tanggal_daftar: editingItem.value.tanggal_daftar,
    _method: "PUT", // Laravel's way to handle PUT/PATCH requests with JSON
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 422 && result.errors) {
        editErrors.value = result.errors;
      } else {
        throw new Error(result.message || "Gagal memperbarui data.");
      }
    } else {
      // Find the index and update the original registration list
      const index = registrations.value.findIndex((r) => r.id === id);
      if (index !== -1) {
        registrations.value[index] = result;
      }
      cancelEdit();
    }
  } catch (err) {
    console.error("Update Error:", err);
    error.value = "Gagal memperbarui data.";
  } finally {
    loading.value = false;
  }
};

const deleteRegistration = async (id) => {
  if (
    !confirm(
      `Apakah Anda yakin ingin MENGHAPUS PERMANEN pendaftaran ID: ${id}?`
    )
  ) {
    return;
  }
  loading.value = true;
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok)
      throw new Error(`HTTP ${response.status} Gagal menghapus`);

    // Remove item from the list
    registrations.value = registrations.value.filter((item) => item.id !== id);
    if (editingItem.value && editingItem.value.id === id) {
      cancelEdit();
    }
  } catch (err) {
    console.error("Delete Error:", err);
    error.value = "Gagal menghapus data.";
  } finally {
    loading.value = false;
  }
};

// Lifecycle Hook
onMounted(() => {
  fetchRegistrations();
});
</script>
