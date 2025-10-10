<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
    <div class="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">

      <header class="flex justify-between items-center mb-6 border-b-4 border-blue-200 pb-3">
        <div class="flex items-center">
          <img
            src="https://img.okadoc.com/plain/200x200/photos/practitioner/photo/73503/okadoc-doctor-psychiatrist-johan-kurniawan-20200420165834.jpg"
            alt="Foto Dr. Johan" class="w-16 h-16 rounded-full object-cover shadow-xl border-2 border-blue-200 mr-4" />
          <div>
            <h1 class="text-2xl font-extrabold text-blue-800">
              Manajemen Praktik dr. Johan
            </h1>
            <p class="text-gray-600 text-sm">
              Spesialis Kedokteran Jiwa atau Psikiatri
            </p>
          </div>
        </div>
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