<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border">
      <h2 class="text-xl font-bold mb-4">Tambah Lokasi Praktik 🩺</h2>

      <form @submit.prevent="submitForm">
        <label class="text-sm font-semibold text-gray-700 mb-2 block"
          >Lokasi Praktik</label
        >
        <input
          v-model="newLocation"
          type="text"
          placeholder="Contoh: Klinik Harapan Sehat"
          class="w-full mb-4 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <div
          v-if="formErrors"
          class="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg mb-4"
        >
          <p class="font-semibold text-red-700 text-sm">Validasi gagal:</p>
          <ul class="mt-1 ml-4 list-disc text-red-600 text-sm">
            <li v-for="(error, key) in formErrors" :key="key">
              <strong>{{ key }}</strong
              >: {{ error.join(", ") }}
            </li>
          </ul>
        </div>

        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="praktikStore.loading"
            class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold disabled:bg-gray-400"
          >
            <span v-if="praktikStore.loading">Menyimpan...</span>
            <span v-else>Simpan</span>
          </button>

          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-3 bg-gray-400 text-white rounded-xl font-semibold hover:bg-gray-500"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { usePraktikStore } from "@/stores/praktikStore";

const props = defineProps({
  visible: Boolean,
});

const praktikStore = usePraktikStore();

const newLocation = ref("");
const formErrors = ref(null);

const submitForm = async () => {
  const payload = {
    lokasi_praktik: newLocation.value || null,
  };

  const res = await praktikStore.createPraktik(payload);

  if (res?.validationErrors) {
    formErrors.value = res.validationErrors;
    return;
  }

  newLocation.value = "";
  formErrors.value = null;
  emitClose();
};

const emitClose = () => {
  formErrors.value = null;
  newLocation.value = "";
  emit("close");
};

const emit = defineEmits(["close"]);
</script>
