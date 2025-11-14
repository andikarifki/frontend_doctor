<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
    <form @submit.prevent="tambahPraktik">
      <!-- Pilih Pasien -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">Cari Nama   Pasien</label>
        <select
          v-model="form.pasien_id"
          class="w-full border border-gray-300 rounded-md p-2"
          required
        >
          <option value="" disabled>Pilih pasien</option>
          <option
            v-for="pasien in daftarPasien"
            :key="pasien.id"
            :value="pasien.id"
          >
            {{ pasien.nama }}
          </option>
        </select>
      </div>

      <!-- Pilih Lokasi Praktik -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">Lokasi Berobat</label>
        <select
          v-model="form.praktik_id"
          class="w-full border border-gray-300 rounded-md p-2"
          required
        >
          <option value="" disabled>Pilih lokasi Berobat</option>
          <option v-for="item in daftarPraktik" :key="item.id" :value="item.id">
            {{ item.lokasi_praktik }}
          </option>
        </select>
      </div>

      <!-- Tombol -->
      <div class="flex justify-end space-x-3">
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Simpan
        </button>
      </div>
    </form>

    <!-- Notifikasi -->
    <p v-if="pesan" class="mt-4 text-green-600 font-semibold">{{ pesan }}</p>
    <p v-if="error" class="mt-4 text-red-600 font-semibold">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios"; // pastikan sudah dikonfigurasi sebelumnya

const daftarPasien = ref([]);
const daftarPraktik = ref([]);
const pesan = ref("");
const error = ref("");

const form = ref({
  pasien_id: "",
  praktik_id: "",
});

const getDaftarPasien = async () => {
  try {
    const res = await api.get("/pasien");
    daftarPasien.value = res.data.data || res.data;
  } catch {
    error.value = "Gagal memuat daftar pasien.";
  }
};

const getDaftarPraktik = async () => {
  try {
    const res = await api.get("/pendaftaran-praktik");
    daftarPraktik.value = res.data.data || res.data;
  } catch {
    error.value = "Gagal memuat daftar praktik.";
  }
};

const tambahPraktik = async () => {
  try {
    await api.post(`/pasien/${form.value.pasien_id}/praktik`, {
      praktik_id: form.value.praktik_id,
    });
    pesan.value = "Praktik berhasil ditambahkan ✅";
    form.value.praktik_id = "";
    form.value.pasien_id = "";
  } catch (err) {
    error.value = err.response?.data?.message || "Gagal menambah praktik.";
  }
};

onMounted(() => {
  getDaftarPasien();
  getDaftarPraktik();
});
</script>

<style scoped>
select:invalid {
  color: gray;
}
</style>
