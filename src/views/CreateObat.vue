<template>
  <div class="p-6 max-w-2xl mx-auto bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-4">Tambah Obat Baru</h1>

    <div class="grid grid-cols-1 gap-4">
      <!-- Nama Obat -->
      <div>
        <label class="block mb-1 font-semibold">Nama Obat</label>
        <input
          type="text"
          v-model="form.nama_obat"
          class="border rounded w-full px-3 py-2"
          placeholder="Contoh: Paracetamol"
        />
      </div>

      <!-- Stok -->
      <div>
        <label class="block mb-1 font-semibold">Stok</label>
        <input
          type="number"
          v-model="form.stok"
          min="0"
          class="border rounded w-full px-3 py-2"
        />
      </div>

      <!-- Satuan -->
      <div>
        <label class="block mb-1 font-semibold">Satuan</label>
        <input
          type="text"
          v-model="form.satuan"
          class="border rounded w-full px-3 py-2"
          placeholder="Contoh: tablet, kapsul"
        />
      </div>

      <!-- Kategori -->
      <div>
        <label class="block mb-1 font-semibold">Kategori</label>
        <input
          type="text"
          v-model="form.kategori"
          class="border rounded w-full px-3 py-2"
          placeholder="Contoh: Analgesik, Antibiotik"
        />
      </div>

      <!-- Expired Date -->
      <div>
        <label class="block mb-1 font-semibold">Tanggal Kadaluarsa</label>
        <input
          type="date"
          v-model="form.expired_date"
          class="border rounded w-full px-3 py-2"
        />
      </div>

      <!-- Harga -->
      <div>
        <label class="block mb-1 font-semibold">Harga</label>
        <input
          type="number"
          v-model="form.harga"
          min="0"
          class="border rounded w-full px-3 py-2"
        />
      </div>

      <!-- Keterangan -->
      <div>
        <label class="block mb-1 font-semibold">Keterangan</label>
        <textarea
          v-model="form.keterangan"
          class="border rounded w-full px-3 py-2"
          rows="3"
          placeholder="Opsional"
        ></textarea>
      </div>

      <!-- Tombol Simpan -->
      <div class="flex gap-2">
        <button
          @click="submitForm"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Simpan
        </button>
        <router-link
          to="/medicine"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Batal
        </router-link>
      </div>
    </div>

    <div v-if="message" class="mt-4 p-2 bg-green-100 text-green-700 rounded">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router"; // <-- wajib import
import axios from "axios";

const router = useRouter(); // <-- buat router instance

const form = reactive({
  nama_obat: "",
  stok: 0,
  satuan: "",
  kategori: "",
  expired_date: "",
  harga: 0,
  keterangan: "",
});

const message = ref("");

const submitForm = async () => {
  if (!form.nama_obat || form.stok < 0) {
    alert("Nama obat dan stok wajib diisi.");
    return;
  }

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/stok-obat",
      form
    );
    if (response.data.success) {
      // setelah berhasil, langsung pindah ke daftar stok obat
      router.push("/medicine");
    }
  } catch (error) {
    console.error("Gagal menambahkan obat:", error);
    alert("Terjadi kesalahan saat menyimpan data.");
  }
};
</script>

<style scoped>
input,
textarea {
  outline: none;
}
</style>
