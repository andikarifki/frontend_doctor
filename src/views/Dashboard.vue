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
        placeholder="🔍 Cari nama pasien..."
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

        <template v-for="(pasien, index) in patients" :key="pasien.id">
          <tr
            v-if="editingId === pasien.id"
            class="bg-yellow-100 transition duration-100"
          >
            <td colspan="6" class="p-4 border-t-4 border-yellow-500">
              <form
                @submit.prevent="submitEdit(pasien.id)"
                class="space-y-3 p-4 border border-orange-400 rounded-lg bg-orange-50 shadow-inner"
              >
                <h5 class="text-md font-bold text-orange-700">
                  ✏️ Edit Pasien ID {{ pasien.id }}
                </h5>

                <div class="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                  <div class="col-span-2 md:col-span-1">
                    <label class="block text-xs font-medium text-gray-600 mb-1"
                      >NIK (16 Digit)</label
                    >
                    <input
                      type="text"
                      v-model="editForm.nik"
                      required
                      minlength="16"
                      maxlength="16"
                      placeholder="NIK (16 digit)"
                      class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                  </div>

                  <div class="col-span-2 md:col-span-1">
                    <label class="block text-xs font-medium text-gray-600 mb-1"
                      >Nama</label
                    >
                    <input
                      type="text"
                      v-model="editForm.nama"
                      required
                      placeholder="Nama Pasien"
                      class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                  </div>

                  <div class="col-span-1 md:col-span-1">
                    <label class="block text-xs font-medium text-gray-600 mb-1"
                      >Tgl. Lahir</label
                    >
                    <input
                      type="date"
                      v-model="editForm.tanggal"
                      required
                      class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                  </div>

                  <div class="col-span-1 md:col-span-1">
                    <label class="block text-xs font-medium text-gray-600 mb-1"
                      >Status</label
                    >
                    <select
                      v-model="editForm.status"
                      class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                      <option value="Meninggal">Meninggal</option>
                    </select>
                  </div>

                  <div class="col-span-2 md:col-span-1 flex space-x-2 pt-4">
                    <button
                      type="submit"
                      :disabled="loading"
                      class="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-3 rounded transition disabled:bg-gray-400 text-sm flex-1"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      @click="editingId = null"
                      class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1.5 px-3 rounded transition text-sm flex-1"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </form>
            </td>
          </tr>

          <tr v-else class="hover:bg-indigo-50 transition duration-100">
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
                class="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition"
              >
                Detail
              </button>
              <button
                @click="handleEditPasien(pasien)"
                class="bg-yellow-500 hover:bg-yellow-600 text-gray-800 text-xs py-1 px-2 rounded transition"
              >
                Edit
              </button>
              <button
                @click="handleDeleteConfirmation(pasien.id, pasien.nama)"
                class="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded transition"
              >
                Hapus
              </button>
            </td>
          </tr>
        </template>
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
const { updatePatient, deletePatient, fetchPatients } = store;

const editingId = ref(null);
const searchQuery = ref("");
let searchTimeout = null;

const editForm = ref({
  nik: "",
  nama: "",
  tanggal: "",
  status: "",
});

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

const handleEditPasien = (pasien) => {
  editingId.value = pasien.id;
  editForm.value = {
    nik: pasien.nik || "",
    nama: pasien.nama,
    tanggal: pasien.tanggal?.substring(0, 10) || "",
    status: pasien.status,
  };
};

const submitEdit = async (id) => {
  try {
    const { praktik_id, ...payload } = editForm.value;
    await updatePatient(id, payload);
    editingId.value = null;
    alert("✅ Data pasien berhasil diperbarui!");
  } catch (err) {
    alert("❌ Gagal update pasien: " + (err.response?.data?.message || err));
  }
};

const handleDeleteConfirmation = (id, nama) => {
  if (confirm(`[KONFIRMASI HAPUS] Hapus Pasien: ${nama} (ID: ${id})?`)) {
    deletePatient(id).then(() => fetchPatients());
  }
};
</script>
