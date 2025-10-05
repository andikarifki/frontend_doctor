<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
    <div class="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <h1 class="text-4xl font-extrabold text-blue-700 text-center mb-6 border-b-4 border-blue-200 pb-3">Klien API
        Pasien & Riwayat Medis (Vue 3 + Tailwind)</h1>

      <section class="mb-10">
        <h2
          class="text-2xl font-semibold border-b-2 border-blue-500 pb-2 mb-6 text-gray-800 flex justify-between items-center">
          1. Daftar Pasien & Riwayat Medis
          <button @click="store.fetchPatients()" :disabled="store.loading"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-400 text-base shadow">
            <span v-if="store.loading && !store.patients.length">Memuat...</span>
            <span v-else>Refresh Data 🔄</span>
          </button>
        </h2>
        <Dashboard />
      </section>

      <hr class="my-10 border-gray-300" />

      <section class="mb-10">
        <h2 class="text-2xl font-semibold border-b-2 border-green-500 pb-2 mb-6 text-gray-800">2. Tambah Pasien Baru
          (POST /api/pasien)</h2>
        <AddPasienForm />
      </section>

      <hr class="my-10 border-gray-300" />

      <section>
        <h2 class="text-2xl font-semibold border-b-2 border-gray-400 pb-2 mb-6 text-gray-800">3. Respon API Terakhir
        </h2>
        <div :class="{
          'bg-green-100 border-green-400 text-green-700': store.apiResponse && store.apiResponse.status >= 200 && store.apiResponse.status < 300,
          'bg-red-100 border-red-400 text-red-700': store.apiError || (store.apiResponse && store.apiResponse.status >= 400),
          'bg-gray-100 border-gray-400 text-gray-700': !store.apiResponse && !store.apiError
        }" class="p-4 rounded-lg border overflow-auto max-h-96 font-mono text-sm shadow-inner">

          <p v-if="store.apiError" class="font-bold mb-2">ERROR JARINGAN/API: {{ store.apiError }}</p>

          <pre>{{ store.apiResponse ? JSON.stringify(store.apiResponse, null, 2) : 'Hasil respon akan muncul di sini...' }}</pre>
        </div>
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