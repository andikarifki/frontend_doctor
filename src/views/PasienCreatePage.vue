<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
    <div class="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <router-link
        :to="{ name: 'Dashboard' }"
        class="inline-block mb-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition text-sm"
      >
        ← Kembali ke Dashboard
      </router-link>

      <h1
        class="text-3xl font-extrabold text-green-700 text-center mb-6 border-b-4 border-green-200 pb-3"
      >
        ➕ Tambah Pasien Baru
      </h1>

      <p class="text-gray-600 mb-8 text-center">
        Lengkapi formulir di bawah ini untuk mendaftarkan pasien baru.
      </p>

      <AddPasienForm />
    </div>
  </div>
</template>

<script setup>
import AddPasienForm from "../components/AddPasienForm.vue";
// Tidak perlu Pinia di sini, semua logika ada di komponen formulir anak.
</script>
