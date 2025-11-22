<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- 💬 Pesan API -->
    <div
      v-if="apiMessage"
      :class="messageClass"
      class="p-3 rounded-lg font-medium transition-all"
    >
      {{ apiMessage }}

      <ul
        v-if="validationErrors.length"
        class="mt-2 list-disc list-inside text-sm text-red-600"
      >
        <li v-for="(err, i) in validationErrors" :key="i">{{ err }}</li>
      </ul>
    </div>

    <h3 class="text-xl font-semibold text-blue-700 border-b pb-2">
      Data Pasien
    </h3>

    <!-- FORM -->
    <div class="grid grid-cols-1 gap-4">
      <!-- NIK -->
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >NIK (16 digit)</label
        >
        <input
          v-model="form.nik"
          type="text"
          minlength="16"
          maxlength="16"
          required
          placeholder="Masukkan NIK"
          class="mt-1 block w-full border border-gray-300 rounded-md p-3"
        />
      </div>

      <!-- Nama -->
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Nama Lengkap</label
        >
        <input
          v-model="form.nama"
          type="text"
          required
          placeholder="Nama pasien"
          class="mt-1 block w-full border border-gray-300 rounded-md p-3"
        />
      </div>

      <!-- Tanggal -->
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Tanggal Lahir</label
        >
        <input
          v-model="form.tanggal"
          type="date"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md p-3"
        />
      </div>

      <!-- Telepon -->
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >No Telepon</label
        >
        <input
          v-model="form.no_tlp"
          type="text"
          required
          placeholder="08xxxxxxxxxx"
          class="mt-1 block w-full border border-gray-300 rounded-md p-3"
        />
      </div>
    </div>

    <div class="pt-4 border-t">
      <button
        type="submit"
        :disabled="store.loading"
        class="w-full py-3 text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm disabled:bg-gray-400 transition"
      >
        {{ store.loading ? "Memproses..." : "Simpan Data Pasien" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { usePasienStore } from "@/stores/pasienStore";

const router = useRouter();
const store = usePasienStore();

// 🔧 Data Form
const form = ref({
  nik: "",
  nama: "",
  tanggal: new Date().toISOString().substring(0, 10),
  status: "Aktif",
  no_tlp: "",
});

const apiMessage = ref(null);
const validationErrors = ref([]);

const messageClass = computed(() => {
  if (validationErrors.value.length > 0) {
    return "bg-red-100 text-red-700 border border-red-400";
  }
  if (store.apiResponse) {
    return "bg-green-100 text-green-700 border border-green-400";
  }
  return "";
});

const resetForm = () => {
  form.value = {
    nik: "",
    nama: "",
    tanggal: new Date().toISOString().substring(0, 10),
    status: "Aktif",
    no_tlp: "",
  };
};

const handleSubmit = async () => {
  apiMessage.value = null;
  validationErrors.value = [];

  try {
    await store.addPatient(form.value);

    // Sukses → langsung redirect
    router.push({ name: "Pasien" });
  } catch (err) {
    apiMessage.value = "⚠️ Gagal menyimpan data.";

    if (err.response?.status === 422) {
      const errors = err.response.data.errors || {};
      validationErrors.value = Object.values(errors).flat();
      apiMessage.value = "⚠️ Validasi gagal, periksa kembali data.";
    }
  }
};
</script>
