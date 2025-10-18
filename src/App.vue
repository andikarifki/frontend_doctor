<template>
  <div class="min-h-screen bg-gray-100 flex">
    <aside
      v-if="!needsFullLayout"
      class="w-64 bg-blue-800 text-white flex-shrink-0 shadow-2xl p-4 hidden lg:block"
    >
      <div class="mb-8 p-2">
        <h1
          class="text-xl font-extrabold text-blue-100 border-b border-blue-600 pb-2"
        >
          Dr. Johan
        </h1>
        <p class="text-blue-300 text-xs">Manajemen Praktik</p>
      </div>

      <nav>
        <h2
          class="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wider"
        >
          Menu Utama
        </h2>
        <ul class="space-y-1">
          <li>
            <router-link
              to="/"
              class="flex items-center p-3 rounded-lg transition duration-150 ease-in-out font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <svg
                class="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              Dashboard
            </router-link>
          </li>
          <li>
            <router-link
              to="/daftar-praktik"
              class="flex items-center p-3 rounded-lg transition duration-150 ease-in-out font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <svg
                class="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 01-4 4"
                ></path>
              </svg>
              Daftar Praktik
            </router-link>
          </li>
          <li>
            <router-link
              to="/jadwal"
              class="flex items-center p-3 rounded-lg transition duration-150 ease-in-out font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <svg
                class="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              Jadwal Praktik
            </router-link>
          </li>
          <li>
            <router-link
              to="/pengaturan"
              class="flex items-center p-3 rounded-lg transition duration-150 ease-in-out font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <svg
                class="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.22 2.572-1.065z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              Pengaturan
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <div class="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div
        class="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl h-full"
        :class="{
          'max-w-md p-10': needsFullLayout,
          'p-6 sm:p-8': !needsFullLayout,
        }"
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

        <div :class="{ 'min-h-[70vh]': !needsFullLayout }">
          <router-view></router-view>
        </div>
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

const needsFullLayout = computed(() => {
  // Cek jika meta field 'fullLayout' diatur ke true untuk rute ini.
  return route.meta.fullLayout === true;
});

onMounted(() => {
  if (!needsFullLayout.value) {
    store.fetchPatients();
  }
});
</script>
