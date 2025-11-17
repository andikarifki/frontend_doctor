<template>
  <div
    class="pasien-detail p-6 max-w-5xl mx-auto bg-white shadow-xl rounded-2xl mt-8"
  >
    <!-- LOADING STATE -->
    <div v-if="isLoading" class="text-center py-10 text-gray-600 animate-pulse">
      <h3 class="text-lg font-semibold">
        Memuat data pasien ID: {{ pasienId }}... ⏳
      </h3>
    </div>

    <!-- ERROR STATE -->
    <div v-else-if="error" class="text-center py-10 text-red-600">
      <h3 class="text-xl font-bold">Gagal memuat data 🚨</h3>
      <p class="mt-2">{{ error }}</p>
    </div>

    <!-- NOT FOUND STATE -->
    <div v-else-if="!pasien.id" class="text-center py-10 text-gray-700">
      <h3 class="text-xl font-semibold">
        Data Pasien ID: {{ pasienId }} Tidak Ditemukan 🚫
      </h3>
    </div>

    <!-- DATA PASIEN -->
    <div v-else class="space-y-8">
      <!-- HEADER -->
      <div class="border-b pb-4 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-blue-800">
            Detail Pasien: {{ pasien.nama }}
          </h2>
          <p class="text-gray-600">ID Pasien: {{ pasien.id }}</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="toggleEdit"
            class="bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-2 px-3 rounded flex items-center gap-2"
          >
            ✏️ {{ isEditing ? "Batal" : "Edit" }}
          </button>
          <button
            @click="openWhatsApp(editableInfo['No. Telepon'])"
            class="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.52 0 .27 5.25.27 11.76a11.64 11.64 0 001.6 5.93L0 24l6.49-1.7a12.1 12.1 0 005.52 1.34h.01c6.54 0 11.79-5.25 11.79-11.76a11.72 11.72 0 00-3.29-8.4zM12 21.3a9.44 9.44 0 01-4.81-1.31l-.34-.2-3.86 1 1.03-3.76-.22-.35a9.39 9.39 0 01-1.44-5.02C2.36 6.8 6.81 2.4 12 2.4a9.5 9.5 0 019.6 9.36c0 5.3-4.43 9.54-9.6 9.54zm5.04-7.15c-.27-.14-1.63-.8-1.88-.89-.25-.1-.43-.14-.6.14-.17.27-.68.89-.83 1.07-.15.17-.3.2-.55.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.15-.27-.02-.41.11-.55.12-.12.27-.3.41-.45.14-.17.18-.27.27-.45.09-.17.05-.34-.02-.48-.07-.14-.6-1.44-.82-1.97-.22-.54-.44-.46-.6-.46h-.5c-.17 0-.48.07-.73.34-.25.27-.95.93-.95 2.27s.97 2.64 1.11 2.82c.14.17 1.9 3 4.62 4.15.65.28 1.15.45 1.55.58.65.2 1.24.17 1.7.1.52-.08 1.63-.66 1.86-1.3.22-.65.22-1.2.15-1.31-.07-.11-.25-.18-.52-.32"
              />
            </svg>
            WhatsApp
          </button>
        </div>
      </div>

      <!-- INFORMASI DASAR -->
      <section>
        <h3 class="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">
          🧾 Informasi Dasar
        </h3>
        <table class="w-full border border-gray-200 rounded-lg overflow-hidden">
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="(value, key) in editableInfo"
              :key="key"
              class="hover:bg-gray-50"
            >
              <th
                class="w-1/3 text-left bg-gray-100 px-4 py-2 font-medium text-gray-700 capitalize"
              >
                {{ key }}
              </th>
              <td class="px-4 py-2 text-gray-800">
                <template v-if="isEditing">
                  <template v-if="key === 'Status'">
                    <select
                      v-model="editableInfo[key]"
                      class="border rounded px-2 py-1 w-full"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                  </template>
                  <template v-else>
                    <input
                      v-model="editableInfo[key]"
                      class="border rounded px-2 py-1 w-full"
                      :type="key === 'Tanggal Lahir' ? 'date' : 'text'"
                    />
                  </template>
                </template>
                <template v-else>
                  <span
                    :class="{
                      'text-green-600 font-semibold':
                        key === 'Status' && value === 'Aktif',
                      'text-red-600 font-semibold':
                        key === 'Status' && value === 'Tidak Aktif',
                    }"
                  >
                    {{ key === "Tanggal Lahir" ? formatDate(value) : value }}
                  </span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="isEditing" class="mt-4 flex gap-2">
          <button
            @click="saveChanges"
            class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            💾 Simpan Perubahan
          </button>
        </div>
      </section>

      <!-- DAFTAR PRAKTIK -->
      <section>
        <h3 class="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">
          🏥 Tempat Periksa
        </h3>
        <div v-if="pasien.praktiks && pasien.praktiks.length > 0">
          <table
            class="w-full border border-gray-200 rounded-lg overflow-hidden"
          >
            <thead class="bg-blue-100">
              <tr>
                <th class="px-4 py-2 text-left">Lokasi</th>
                <th class="px-4 py-2 text-left">Tanggal Daftar Kontrol</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="praktik in pasien.praktiks"
                :key="praktik.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-2">{{ praktik.lokasi_praktik }}</td>
                <td class="px-4 py-2">
                  {{ formatDate(praktik.pivot?.tanggal_daftar) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-gray-600 italic mt-2">
          Pasien ini belum terdaftar di praktik manapun.
        </p>
      </section>

      <!-- CATATAN MEDIS -->
      <section>
        <h3 class="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">
          💊 Catatan Medis
        </h3>
        <div v-if="pasien.medical_records && pasien.medical_records.length > 0">
          <table
            class="w-full border border-gray-200 rounded-lg overflow-hidden"
          >
            <thead class="bg-green-100">
              <tr>
                <th class="px-4 py-2 text-left">Tanggal Kontrol</th>
                <th class="px-4 py-2 text-left">Tempat Berobat Pasien</th>
                <th class="px-4 py-2 text-left">Diagnosis</th>
                <th class="px-4 py-2 text-left">Obat</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="record in pasien.medical_records"
                :key="record.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-2">
                  {{ formatDate(record.tanggal_periksa) }}
                </td>
                <td class="px-4 py-2">
                  {{ record.praktik?.lokasi_praktik || "-" }}
                </td>
                <td class="px-4 py-2">{{ record.diagnosis }}</td>
                <td class="px-4 py-2">{{ record.obat }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-gray-600 italic mt-2">
          Belum ada catatan medis untuk pasien ini.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { usePasienStore } from "@/stores/pasienStore";

const route = useRoute();
const store = usePasienStore();

const pasien = ref({});
const isLoading = ref(true);
const error = ref(null);
const isEditing = ref(false);

const pasienId = computed(() => route.params.id);

// Format date untuk tampilan
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Editable info untuk form edit
const editableInfo = ref({});

const fetchPasienData = async (id) => {
  try {
    isLoading.value = true;
    error.value = null;

    const data = await store.getPatientById(id);
    pasien.value = data;

    // Mapping untuk form edit
    editableInfo.value = {
      NIK: data.nik,
      Nama: data.nama,
      "Tanggal Lahir": data.tanggal?.substring(0, 10) || "",
      Status: data.status,
      "No. Telepon": data.no_tlp ?? "",
    };
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

// Toggle mode edit
const toggleEdit = () => {
  isEditing.value = !isEditing.value;

  if (!isEditing.value && pasien.value.id) {
    // Reset ke data asli
    editableInfo.value = {
      NIK: pasien.value.nik,
      Nama: pasien.value.nama,
      "Tanggal Lahir": pasien.value.tanggal?.substring(0, 10) || "",
      Status: pasien.value.status,
      "No. Telepon": pasien.value.no_tlp ?? "",
    };
  }
};

// Save changes
const saveChanges = async () => {
  try {
    const payload = {
      nama: editableInfo.value.Nama,
      tanggal: editableInfo.value["Tanggal Lahir"],
      status: editableInfo.value.Status,
      "No. Telepon": pasien.value.no_tlp || "",
    };

    await store.updatePatient(pasienId.value, payload);

    pasien.value = { ...pasien.value, ...payload };
    isEditing.value = false;

    alert("Data pasien berhasil diperbarui ✅");
  } catch (err) {
    console.error("Gagal update pasien:", err);
    alert("Gagal memperbarui data: " + err.message);
  }
};

// WhatsApp
const openWhatsApp = (number) => {
  if (!number) return alert("Nomor WhatsApp tidak tersedia.");
  const cleaned = number.replace(/^0/, "62");
  const url = `https://wa.me/${cleaned}`;
  window.open(url, "_blank");
};

onMounted(() => fetchPasienData(pasienId.value));
watch(pasienId, (newId) => fetchPasienData(newId));
</script>
