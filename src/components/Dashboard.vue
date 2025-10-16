<template>
  <div class="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
    <!-- Header atas -->
    <section
      class="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center"
    >
      <button
        @click="goToCreatePage"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition text-sm"
      >
        ➕ Tambah Pasien Baru
      </button>
      <button
        @click="handleLogout"
        class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition text-sm"
      >
        🚪 Logout
      </button>
    </section>

    <!-- Tabel pasien -->
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-blue-800 text-white">
        <tr>
          <th
            class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
          >
            ID
          </th>
          <th
            class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
          >
            Nama
          </th>
          <th
            class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
          >
            Praktik
          </th>
          <th
            class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
          >
            Tanggal Lahir
          </th>
          <th
            class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
          >
            Status
          </th>
          <th
            class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-1/4"
          >
            Riwayat & Aksi
          </th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <!-- Loading / kosong -->
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

        <!-- Loop pasien -->
        <template v-for="pasien in patients" :key="pasien.id">
          <!-- FORM EDIT PASIEN -->
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

                <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <input
                    type="text"
                    v-model="editForm.nama"
                    required
                    placeholder="Nama Pasien"
                    class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                  <input
                    type="date"
                    v-model="editForm.tanggal"
                    required
                    class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                  <select
                    v-model="editForm.status"
                    class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                    <option value="Meninggal">Meninggal</option>
                  </select>

                  <!-- Dropdown Praktik -->
                  <select
                    v-model="editForm.praktik_id"
                    class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  >
                    <option value="" disabled>-- Pilih Praktik --</option>
                    <option
                      v-for="praktik in praktikList"
                      :key="praktik.id"
                      :value="praktik.id"
                    >
                      {{
                        praktik.nama_praktik ||
                        praktik.lokasi_praktik ||
                        praktik.nama
                      }}
                    </option>
                  </select>

                  <div class="flex space-x-2">
                    <button
                      type="submit"
                      :disabled="loading"
                      class="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-3 rounded transition disabled:bg-gray-400 text-sm"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      @click="editingId = null"
                      class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1.5 px-3 rounded transition text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </form>
            </td>
          </tr>

          <!-- DATA PASIEN -->
          <tr
            v-if="editingId !== pasien.id"
            :class="{ 'bg-blue-50': expandedId === pasien.id }"
            class="hover:bg-indigo-50 transition duration-100"
          >
            <td class="px-4 py-3 text-sm font-medium text-gray-900">
              {{ pasien.id }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ pasien.nama }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{
                pasien.praktik?.lokasi_praktik ||
                pasien.praktik?.nama_praktik ||
                "-"
              }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ pasien.tanggal ? pasien.tanggal.substring(0, 10) : "-" }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <span
                :class="{
                  'bg-green-100 text-green-800': pasien.status === 'Aktif',
                  'bg-yellow-100 text-yellow-800':
                    pasien.status === 'Tidak Aktif',
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
                @click="toggleRiwayat(pasien.id)"
                class="text-indigo-600 hover:text-indigo-900 text-xs py-1 px-2 border border-indigo-600 rounded transition"
              >
                Riwayat ({{ pasien.medical_records.length }})
              </button>
              <button
                @click="toggleAddRecordForm(pasien.id)"
                class="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition"
              >
                ➕ Tambah Riwayat
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

          <!-- DETAIL RIWAYAT -->
          <tr
            v-if="expandedId === pasien.id"
            class="bg-gray-100 transition-all duration-300"
          >
            <td colspan="6" class="p-4 border-t-4 border-yellow-500">
              <!-- FORM TAMBAH RIWAYAT (visible ketika formVisibleId === pasien.id) -->
              <form
                v-if="formVisibleId === pasien.id"
                @submit.prevent="submitMedis(pasien.id)"
                class="space-y-3 p-4 mb-6 border border-yellow-400 rounded-lg bg-yellow-50 shadow-inner"
              >
                <h5 class="text-md font-bold text-orange-700">
                  Input Riwayat Medis Baru
                </h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    v-model="medisForm.tanggal_periksa"
                    required
                    class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                  <input
                    type="text"
                    v-model="medisForm.diagnosis"
                    required
                    placeholder="Diagnosis"
                    class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    v-model="medisForm.obat"
                    required
                    placeholder="Obat"
                    class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                  <input
                    type="text"
                    v-model="medisForm.lokasi_berobat"
                    required
                    placeholder="Lokasi Berobat"
                    class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                </div>
                <div class="flex space-x-2">
                  <button
                    type="submit"
                    :disabled="loading"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded transition disabled:bg-gray-400 text-sm"
                  >
                    Simpan Riwayat Medis
                  </button>
                  <button
                    type="button"
                    @click="formVisibleId = null"
                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1.5 px-3 rounded transition text-sm"
                  >
                    Batal
                  </button>
                </div>
              </form>

              <!-- DAFTAR RIWAYAT -->
              <div class="mt-4">
                <ul v-if="pasien.medical_records.length" class="space-y-2">
                  <li
                    v-for="record in pasien.medical_records"
                    :key="record.id"
                    class="bg-white p-3 border-l-4 border-yellow-500 shadow-sm text-sm"
                  >
                    <div
                      v-if="editingRecordId !== record.id"
                      class="flex justify-between items-start"
                    >
                      <div>
                        <strong class="text-gray-700">Diagnosis:</strong>
                        {{ record.diagnosis }} |
                        <strong class="text-gray-700">Tgl:</strong>
                        {{ record.tanggal_periksa.substring(0, 10) }} |
                        <strong class="text-gray-700">Obat:</strong>
                        {{ record.obat }} |
                        <strong class="text-gray-700">Lokasi:</strong>
                        {{ record.lokasi_berobat }}
                      </div>
                      <div class="flex space-x-2 ml-4">
                        <button
                          @click="handleEditRecord(record)"
                          class="bg-yellow-500 hover:bg-yellow-600 text-gray-800 text-xs py-1 px-2 rounded transition"
                        >
                          Edit
                        </button>
                        <button
                          @click="handleDeleteRecord(record.id, pasien.id)"
                          class="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>

                    <!-- FORM EDIT RIWAYAT -->
                    <form
                      v-else
                      @submit.prevent="submitEditRecord(record.id)"
                      class="space-y-2 p-3 border border-yellow-400 rounded-lg bg-yellow-50 shadow-inner"
                    >
                      <h6 class="text-sm font-bold text-orange-700">
                        ✏️ Edit Riwayat ID {{ record.id }}
                      </h6>
                      <input
                        type="date"
                        v-model="editRecordForm.tanggal_periksa"
                        required
                        class="block w-full border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                      />
                      <input
                        type="text"
                        v-model="editRecordForm.diagnosis"
                        required
                        placeholder="Diagnosis"
                        class="block w-full border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                      />
                      <input
                        type="text"
                        v-model="editRecordForm.obat"
                        required
                        placeholder="Obat"
                        class="block w-full border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                      />
                      <input
                        type="text"
                        v-model="editRecordForm.lokasi_berobat"
                        required
                        placeholder="Lokasi Berobat"
                        class="block w-full border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                      />
                      <div class="flex space-x-2 pt-1">
                        <button
                          type="submit"
                          :disabled="loading"
                          class="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded transition disabled:bg-gray-400 text-xs"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          @click="editingRecordId = null"
                          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded transition text-xs"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </li>
                </ul>
                <p v-else class="text-gray-500 italic">
                  Belum ada riwayat medis.
                </p>
              </div>
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
import { useAuthStore } from "../stores/auth";

const store = usePasienStore();
const router = useRouter();
const authStore = useAuthStore();

const { patients, loading } = storeToRefs(store);
const {
  updatePatient,
  addMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  deletePatient,
  fetchPatients,
} = store;

const expandedId = ref(null);
const formVisibleId = ref(null);
const editingId = ref(null);
const praktikList = ref([]);

const editForm = ref({ nama: "", tanggal: "", status: "", praktik_id: "" });
const medisForm = ref({
  tanggal_periksa: "",
  diagnosis: "",
  obat: "",
  lokasi_berobat: "",
});

const editingRecordId = ref(null);
const editRecordForm = ref({
  tanggal_periksa: "",
  diagnosis: "",
  obat: "",
  lokasi_berobat: "",
});

const goToCreatePage = () => router.push({ name: "PasienCreate" });

const handleLogout = () => {
  authStore.logout();
  router.push({ name: "Login" });
};

// load patients + praktik list
const fetchPraktikList = async () => {
  try {
    const res = await axios.get(
      "http://localhost:8000/api/pendaftaran-praktik"
    );
    praktikList.value = res.data.data || res.data;
  } catch (err) {
    console.error("Gagal load daftar praktik:", err);
    praktikList.value = [];
  }
};

onMounted(async () => {
  await fetchPatients();
  await fetchPraktikList();
});

// EDIT PASIEN
const handleEditPasien = (pasien) => {
  editingId.value = pasien.id;
  editForm.value = {
    nama: pasien.nama,
    tanggal: pasien.tanggal?.substring(0, 10) || "",
    status: pasien.status,
    praktik_id: pasien.praktik_id || "",
  };
};

const submitEdit = async (id) => {
  try {
    await updatePatient(id, editForm.value);
    editingId.value = null;
    alert("✅ Data pasien berhasil diperbarui!");
  } catch (err) {
    alert("❌ Gagal update pasien: " + (err.response?.data?.message || err));
  }
};

// toggle riwayat expand
const toggleRiwayat = (id) => {
  // if opening, ensure we reset forms
  if (expandedId.value === id) {
    expandedId.value = null;
    formVisibleId.value = null;
  } else {
    expandedId.value = id;
    formVisibleId.value = null;
    resetMedisForm();
    editingRecordId.value = null;
  }
};

// toggle show/hide add-record form
const toggleAddRecordForm = (id) => {
  if (formVisibleId.value === id) {
    formVisibleId.value = null;
    resetMedisForm();
  } else {
    formVisibleId.value = id;
    resetMedisForm();
    editingRecordId.value = null;
  }
};

const resetMedisForm = () => {
  medisForm.value = {
    tanggal_periksa: "",
    diagnosis: "",
    obat: "",
    lokasi_berobat: "",
  };
};

// SUBMIT TAMBAH RIWAYAT
const submitMedis = async (patientId) => {
  // simple client-side validation
  if (!medisForm.value.tanggal_periksa || !medisForm.value.diagnosis) {
    alert("Isi tanggal periksa dan diagnosis terlebih dahulu.");
    return;
  }

  try {
    await addMedicalRecord({ pasien_id: patientId, ...medisForm.value });
    // After success, close form and refresh patients (store already refreshes in action)
    formVisibleId.value = null;
    resetMedisForm();
    await fetchPatients();
    alert("✅ Riwayat medis ditambahkan!");
  } catch (err) {
    console.error("Gagal tambah riwayat:", err);
    alert(
      "❌ Gagal tambah riwayat: " +
        (err.response?.data?.message || err.message || err)
    );
  }
};

// EDIT RIWAYAT
const handleEditRecord = (record) => {
  editingRecordId.value = record.id;
  editRecordForm.value = {
    tanggal_periksa: record.tanggal_periksa?.substring(0, 10) || "",
    diagnosis: record.diagnosis || "",
    obat: record.obat || "",
    lokasi_berobat: record.lokasi_berobat || "",
  };
  // hide add form
  formVisibleId.value = null;
};

// SUBMIT EDIT RIWAYAT
const submitEditRecord = async (recordId) => {
  try {
    await updateMedicalRecord(recordId, editRecordForm.value);
    editingRecordId.value = null;
    await fetchPatients();
    alert("✅ Riwayat medis berhasil diperbarui!");
  } catch (err) {
    console.error("Gagal update riwayat:", err);
    alert(
      "❌ Gagal update riwayat: " +
        (err.response?.data?.message || err.message || err)
    );
  }
};

// DELETE RIWAYAT
const handleDeleteRecord = async (recordId, patientId) => {
  if (
    !confirm(
      `Hapus riwayat medis ID ${recordId}? Aksi ini tidak dapat dibatalkan.`
    )
  )
    return;

  try {
    await deleteMedicalRecord(recordId, patientId);
    // store.deleteMedicalRecord already updates state locally; ensure latest
    await fetchPatients();
  } catch (err) {
    console.error("Gagal hapus riwayat:", err);
    alert(
      "❌ Gagal hapus riwayat: " +
        (err.response?.data?.message || err.message || err)
    );
  }
};

// DELETE PASIEN
const handleDeleteConfirmation = (id, nama) => {
  if (
    confirm(
      `[KONFIRMASI HAPUS] Hapus Pasien: ${nama} (ID: ${id})?\nAksi ini akan menghapus semua riwayat medis terkait!`
    )
  ) {
    deletePatient(id).then(() => fetchPatients());
  }
};
</script>
