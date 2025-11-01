<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- ✅ Pesan API -->
    <div
      v-if="apiMessage"
      :class="messageClass"
      class="p-3 rounded-lg font-medium transition-all"
    >
      {{ apiMessage }}
      <ul
        v-if="validationErrors.length > 0"
        class="mt-2 list-disc list-inside text-sm text-red-600"
      >
        <li v-for="(error, index) in validationErrors" :key="index">
          {{ error }}
        </li>
      </ul>
    </div>

    <h3 class="text-xl font-semibold text-blue-700 border-b pb-2">
      Data Pasien
    </h3>

    <!-- CONTAINER GRID DIUBAH MENJADI SATU KOLOM (GRID-COLS-1) DI SEMUA LAYAR -->
    <div class="grid grid-cols-1 gap-4">
      <!-- 💳 NIK (Nomor Induk Kependudukan) -->
      <div>
        <label for="nik" class="block text-sm font-medium text-gray-700"
          >NIK (16 Digit)</label
        >
        <input
          type="text"
          id="nik"
          v-model="form.nik"
          required
          placeholder="Masukkan 16 digit NIK"
          minlength="16"
          maxlength="16"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Nama -->
      <div>
        <label for="nama" class="block text-sm font-medium text-gray-700"
          >Nama Lengkap</label
        >
        <input
          type="text"
          id="nama"
          v-model="form.nama"
          required
          placeholder="Contoh: Dika Rifqi"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Tanggal -->
      <div>
        <label for="tanggal" class="block text-sm font-medium text-gray-700"
          >Tanggal Lahir</label
        >
        <input
          type="date"
          id="tanggal"
          v-model="form.tanggal"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Status -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700"
          >Status</label
        >
        <select
          id="status"
          v-model="form.status"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>-- Pilih Status --</option>
          <option value="Aktif">Aktif</option>
          <option value="Tidak Aktif">Tidak Aktif</option>
          <option value="Meninggal">Meninggal</option>
        </select>
      </div>

      <!-- 🏥 Praktik -->
      <!-- TIDAK PERLU MD:COL-SPAN KARENA SUDAH 1 KOLOM -->
      <div>
        <label for="praktik_id" class="block text-sm font-medium text-gray-700"
          >Pilih Lokasi Praktik</label
        >
        <select
          id="praktik_id"
          v-model="form.praktik_id"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>-- Pilih Praktik --</option>
          <option
            v-for="praktik in praktikList"
            :key="praktik.id"
            :value="praktik.id"
          >
            {{ praktik.lokasi_praktik }}
          </option>
        </select>
      </div>
    </div>

    <div class="pt-4 border-t">
      <button
        type="submit"
        :disabled="store.loading"
        class="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 transition"
      >
        {{ store.loading ? "Memproses..." : "Simpan Data Pasien" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { usePasienStore } from "@/stores/pasienStore";
import api from "@/api/axios";

const store = usePasienStore();

// 🧾 Data Form
const form = ref({
  nik: "",
  nama: "",
  tanggal: new Date().toISOString().substring(0, 10),
  status: "",
  praktik_id: "",
});

// 🏥 Daftar praktik
const praktikList = ref([]);

// 🔔 State feedback API
const apiMessage = ref(null);
const validationErrors = ref([]);

// 🎨 Styling pesan API
const messageClass = computed(() => {
  if (store.apiError || validationErrors.value.length > 0) {
    return "bg-red-100 text-red-700 border border-red-400";
  }
  if (store.apiResponse && store.apiResponse.status < 400) {
    return "bg-green-100 text-green-700 border border-green-400";
  }
  return "";
});

// 🔄 Reset form
const resetForm = () => {
  form.value = {
    nik: "",
    nama: "",
    tanggal: new Date().toISOString().substring(0, 10),
    status: "",
    praktik_id: "",
  };
  validationErrors.value = [];
};

// 🚀 Submit form
const handleSubmit = async () => {
  apiMessage.value = null;
  store.apiError = null;
  store.apiResponse = null;
  validationErrors.value = [];

  try {
    await store.addPatient(form.value);
    const responseData = store.apiResponse?.data;
    apiMessage.value =
      responseData?.message || "✅ Pasien berhasil ditambahkan!";
    resetForm();
  } catch (error) {
    apiMessage.value = store.apiError || "❌ Terjadi kesalahan saat menyimpan.";

    if (error.response?.status === 422) {
      const errors = error.response.data.errors || {};
      validationErrors.value = Object.values(errors).flat();
      apiMessage.value = "⚠️ Validasi Gagal! Periksa kembali input Anda.";
    }
  }
};

// 🔁 Ambil data praktik dari API Laravel
const fetchPraktikList = async () => {
  try {
    const response = await api.get("pendaftaran-praktik");
    praktikList.value = response.data?.data || response.data || [];
  } catch (error) {
    console.error("Gagal mengambil daftar praktik:", error);
    praktikList.value = [];
  }
};

// 📦 Load daftar praktik saat komponen di-mount
onMounted(fetchPraktikList);
</script>
