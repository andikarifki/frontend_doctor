<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
    <div
      class="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl"
      :class="{ 'max-w-md p-10': needsFullLayout }"
    >
      <header
        v-if="!needsFullLayout"
        class="flex justify-between items-center mb-6 border-b-4 border-blue-200 pb-3"
      >
        <div class="flex items-center">
          <img
            src="https://img.okadoc.com/plain/200x200/photos/practitioner/photo/73503/okadoc-doctor-psychiatrist-johan-kurniawan-20200420165834.jpg"
            alt="Foto Dr. Johan"
            class="w-16 h-16 rounded-full object-cover shadow-xl border-2 border-blue-200 mr-4"
          />
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

      <div v-if="!needsFullLayout" class="flex flex-col lg:flex-row gap-6">
        <aside
          class="w-full lg:w-64 p-4 bg-blue-50 rounded-lg shadow-inner border border-blue-100"
        >
          <nav>
            <h2 class="text-lg font-bold text-blue-700 mb-4 border-b pb-2">
              Menu Utama
            </h2>
            <ul class="space-y-2">
              <li>
                <router-link
                  to="/"
                  class="flex items-center p-2 text-gray-700 hover:bg-blue-200 rounded-lg transition duration-150 ease-in-out font-medium"
                >
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link
                  to="/daftar"
                  class="flex items-center p-2 text-gray-700 hover:bg-blue-200 rounded-lg transition duration-150 ease-in-out font-medium"
                >
                  Jadwal Praktik
                </router-link>
              </li>
              <li>
                <router-link
                  to="/jadwal"
                  class="flex items-center p-2 text-gray-700 hover:bg-blue-200 rounded-lg transition duration-150 ease-in-out font-medium"
                >
                  Jadwal Praktik
                </router-link>
              </li>
              <li>
                <router-link
                  to="/pengaturan"
                  class="flex items-center p-2 text-gray-700 hover:bg-blue-200 rounded-lg transition duration-150 ease-in-out font-medium"
                >
                  Pengaturan
                </router-link>
              </li>
            </ul>
          </nav>
        </aside>

        <main class="flex-grow min-h-[50vh]">
          <router-view></router-view>
        </main>
      </div>

      <div v-else class="flex justify-center items-center">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { usePasienStore } from "@/stores/pasienStore";
import { useRoute } from "vue-router";

const store = usePasienStore();
const route = useRoute();

// Computed property untuk mengecek apakah rute saat ini memerlukan full layout (misal: Login)
const needsFullLayout = computed(() => {
  // Cek jika meta field 'fullLayout' diatur ke true untuk rute ini.
  return route.meta.fullLayout === true;
});

onMounted(() => {
  // Hanya fetch data jika berada di layout kerja (bukan full layout/login)
  if (!needsFullLayout.value) {
    store.fetchPatients();
  }
});
</script>

<style scoped>
/* (Gaya CSS tetap sama) */
</style>
