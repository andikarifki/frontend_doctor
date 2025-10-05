<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
    <div class="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">

      <header class="flex justify-between items-center mb-6 border-b-4 border-blue-200 pb-3">
        <h1 class="text-4xl font-extrabold text-blue-700 text-center flex-grow">
          Klien API Pasien & Riwayat Medis (Vue 3 + Tailwind)
        </h1>
      </header>

      <router-view></router-view>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePasienStore } from '@/stores/pasienStore';

const store = usePasienStore();

onMounted(() => {
  store.fetchPatients();
});
</script>