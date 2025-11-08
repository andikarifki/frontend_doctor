<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar untuk desktop dan mobile -->
    <aside
      v-if="!needsFullLayout && (showSidebar || isDesktop)"
      class="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white p-4 shadow-2xl z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0"
      :class="{ '-translate-x-full': !showSidebar && !isDesktop }"
    >
      <!-- Profil -->
      <div class="mb-8 p-2">
        <div class="flex items-center">
          <img
            src="https://img.okadoc.com/plain/200x200/photos/practitioner/photo/73503/okadoc-doctor-psychiatrist-johan-kurniawan-20200420165834.jpg"
            alt="Foto Dr. Johan"
            class="w-14 h-14 rounded-full object-cover shadow-xl border-2 border-blue-400 mr-3 flex-shrink-0"
          />
          <div class="text-left overflow-hidden">
            <h1 class="text-lg font-extrabold text-blue-100 truncate">
              dr. Johan
            </h1>
            <p class="text-blue-300 text-xs mt-0.5 whitespace-nowrap">
              Spesialis Kedokteran Jiwa
            </p>
          </div>
        </div>
        <div class="mt-4 border-b border-blue-600 pb-2"></div>
      </div>

      <!-- Menu -->
      <nav>
        <h2
          class="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wider"
        >
          Menu Utama
        </h2>
        <ul class="space-y-1">
          <!-- Dashboard -->
          <li>
            <router-link
              to="/"
              class="flex items-center p-3 rounded-lg transition duration-150 ease-in-out font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3"
                />
              </svg>
              Dashboard
            </router-link>
          </li>

          <!-- Daftar Praktik -->
          <li>
            <router-link
              to="/praktik"
              class="flex items-center p-3 rounded-lg transition duration-150 ease-in-out font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Daftar Praktik
            </router-link>
          </li>

          <!-- Daftar Pasien Berobat -->
          <li>
            <router-link
              to="/pasien-praktik"
              class="flex items-center p-3 rounded-lg transition duration-150 ease-in-out font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Daftar Pasien Berobat
            </router-link>
          </li>

          <!-- Riwayat Medis -->
          <li>
            <router-link
              to="/medical-record"
              class="flex items-center p-3 rounded-lg transition duration-150 ease-in-out font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Riwayat Medis
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Overlay untuk mobile -->
    <div
      v-if="showSidebar && !isDesktop"
      class="fixed inset-0 bg-black opacity-50 z-40"
      @click="showSidebar = false"
    ></div>

    <!-- Konten utama -->
    <div class="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div
        class="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl h-full"
        :class="{
          'max-w-md p-10': needsFullLayout,
          'p-6 sm:p-8': !needsFullLayout,
        }"
      >
        <!-- Header -->
        <header
          v-if="!needsFullLayout"
          class="flex justify-between items-center mb-6 border-b-4 border-blue-200 pb-3"
        >
          <div class="flex items-center">
            <!-- Tombol Hamburger mobile -->
            <button @click="showSidebar = !showSidebar" class="lg:hidden mr-3">
              ☰
            </button>
            <h1 class="text-2xl font-extrabold text-blue-800">
              {{ pageTitle }}
            </h1>
          </div>
          <button
            @click="handleLogout"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition text-sm"
          >
            🚪 Logout
          </button>
        </header>

        <!-- Konten halaman -->
        <div :class="{ 'min-h-[70vh]': !needsFullLayout }">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePasienStore } from "@/stores/pasienStore";
import { useAuthStore } from "@/stores/auth";

const store = usePasienStore();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Sidebar mobile toggle
const showSidebar = ref(false);

// Detect desktop (lg ke atas)
const isDesktop = ref(window.innerWidth >= 1024);
window.addEventListener("resize", () => {
  isDesktop.value = window.innerWidth >= 1024;
  if (isDesktop.value) showSidebar.value = false;
});

// Layout full atau normal
const needsFullLayout = computed(() => route.meta.fullLayout === true);

// Logout
const handleLogout = () => {
  authStore.logout();
  router.push({ name: "Login" });
};

// Judul halaman
const pageTitle = computed(
  () => route.meta.documentTitle || "Manajemen Praktik dr. Johan"
);

// Fetch pasien
onMounted(() => {
  if (!needsFullLayout.value) {
    store.fetchPatients();
  }
});
</script>
