<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
    <div class="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <h1 class="text-4xl font-extrabold text-blue-700 text-center mb-6 border-b-4 border-blue-200 pb-3">Klien API
        Pasien & Riwayat Medis (Vue 3 + Tailwind)</h1>

      <section class="mb-10">
        <h2
          class="text-2xl font-semibold border-b-2 border-blue-500 pb-2 mb-6 text-gray-800 flex justify-between items-center">
          Daftar Pasien & Riwayat Medis
        </h2>
        <Dashboard />
      </section>

      <hr class="my-10 border-gray-300" />

      <section class="mb-10">
        <h2 class="text-2xl font-semibold border-b-2 border-green-500 pb-2 mb-6 text-gray-800">2. Tambah Pasien Baru
          (POST /api/pasien)</h2>
        <AddPasienForm />
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePasienStore } from '@/stores/pasienStore';
import Dashboard from '@/components/Dashboard.vue';
import AddPasienForm from '@/components/AddPasienForm.vue';

const store = usePasienStore();

onMounted(() => {
  store.fetchPatients();
});
</script>