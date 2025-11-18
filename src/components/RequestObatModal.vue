<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
      >
        ✕
      </button>

      <h2 class="text-lg font-semibold mb-4">Form Request Obat</h2>

      <div class="grid grid-cols-1 gap-3">
        <div>
          <label class="block mb-1">Pilih Obat</label>
          <select v-model="obat_id" class="border rounded w-full px-2 py-1">
            <option value="">-- Pilih Obat --</option>
            <option v-for="o in obat" :key="o.id" :value="o.id">
              {{ o.nama_obat }} (stok: {{ o.stok }})
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-1">Jumlah</label>
          <input
            type="number"
            v-model.number="jumlah"
            min="1"
            class="border rounded w-full px-2 py-1"
          />
        </div>

        <div>
          <label class="block mb-1">Tanggal (Opsional)</label>
          <input
            type="date"
            v-model="tanggal"
            class="border rounded w-full px-2 py-1"
          />
        </div>

        <div>
          <label class="block mb-1">Keterangan (Opsional)</label>
          <input
            type="text"
            v-model="keterangan"
            class="border rounded w-full px-2 py-1"
            placeholder="Catatan tambahan"
          />
        </div>
      </div>

      <button
        @click="submitRequest"
        class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        Kirim Permintaan
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import api from "../api/axios";

const props = defineProps({
  show: Boolean,
  obat: Array,
});

const emit = defineEmits(["close", "success"]);

const obat_id = ref("");
const jumlah = ref(1);
const tanggal = ref("");
const keterangan = ref("");

// Reset form ketika modal dibuka
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      obat_id.value = "";
      jumlah.value = 1;
      tanggal.value = "";
      keterangan.value = "";
    }
  }
);

const submitRequest = async () => {
  if (!obat_id.value || jumlah.value < 1)
    return alert("Pilih obat dan jumlah minimal 1");

  const payload = {
    obat_id: obat_id.value,
    jumlah: jumlah.value,
    tanggal: tanggal.value || null,
    keterangan: keterangan.value || null,
  };

  try {
    const res = await api.post("/request-obat-internal", payload);
    if (res.data.success) {
      alert("Permintaan berhasil dikirim");
      emit("success"); // kasih tahu parent untuk refresh riwayat
      emit("close");
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat mengirim permintaan");
  }
};
</script>
