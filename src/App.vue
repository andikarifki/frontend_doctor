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
              class="flex items-center p-3 rounded-lg font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <!-- Home -->
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
                  d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h4m6 0h4a1 1 0 001-1V10"
                />
              </svg>
              Halaman Utama
            </router-link>
          </li>

          <!-- Daftar Praktik -->
          <li>
            <router-link
              to="/praktik"
              class="flex items-center p-3 rounded-lg font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <!-- Stethoscope -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 3v6a6 6 0 0012 0V3m-6 14v4m-4 0h8"
                />
              </svg>
              Daftar Praktik
            </router-link>
          </li>

          <!-- Daftar Pasien Berobat -->
          <li>
            <router-link
              to="/pasien-praktik"
              class="flex items-center p-3 rounded-lg font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <!-- Users -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17 20v-2a4 4 0 00-3-3.87M9 14.13A4 4 0 006 18v2m6-10a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>
              Daftar Pasien Berobat
            </router-link>
          </li>

          <!-- Riwayat Medis -->
          <li>
            <router-link
              to="/medical-record"
              class="flex items-center p-3 rounded-lg font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <!-- Clipboard -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 5h6m2 0h1a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h1m2-2h6v4H9V3z"
                />
              </svg>
              Riwayat Medis
            </router-link>
          </li>

          <!-- Obat -->
          <li>
            <router-link
              to="/medicine"
              class="flex items-center p-3 rounded-lg font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <!-- Pill -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 7a5 5 0 00-9.9-1M3 17a5 5 0 019.9 1M14 10l-4 4"
                />
              </svg>
              Obat
            </router-link>
          </li>

          <!-- Request Obat -->
          <li>
            <router-link
              to="/request-drug"
              class="flex items-center p-3 rounded-lg font-medium text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <!-- Clipboard + Plus -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 11v6m3-3H9m2-9h6v4H9V3zM6 5h1a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1z"
                />
              </svg>
              Request Obat
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
