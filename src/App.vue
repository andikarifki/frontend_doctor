<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
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
          <!-- Menu Admin -->
          <template v-if="role === 'admin'">
            <li>
              <router-link
                to="/dashboard"
                class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
                active-class="bg-blue-600 shadow-md"
                >Halaman Utama</router-link
              >
            </li>
            <li>
              <router-link
                to="/pasien"
                class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
                active-class="bg-blue-600 shadow-md"
                >Pasien</router-link
              >
            </li>
            <li>
              <router-link
                to="/praktik"
                class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
                active-class="bg-blue-600 shadow-md"
                >Daftar Praktik</router-link
              >
            </li>
            <li>
              <router-link
                to="/pasien-praktik"
                class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
                active-class="bg-blue-600 shadow-md"
                >Daftar Pasien Berobat</router-link
              >
            </li>
            <li>
              <router-link
                to="/medical-record"
                class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
                active-class="bg-blue-600 shadow-md"
                >Riwayat Medis</router-link
              >
            </li>
            <li>
              <router-link
                to="/request-drug"
                class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
                active-class="bg-blue-600 shadow-md"
                >Request Obat</router-link
              >
            </li>

            <!-- Submenu Apoteker -->
            <li>
              <button
                @click="apotekOpen = !apotekOpen"
                class="flex items-center w-full p-3 rounded-lg hover:bg-blue-700"
              >
                Apoteker
                <span class="ml-auto text-sm">{{
                  apotekOpen ? "▲" : "▼"
                }}</span>
              </button>
              <ul
                v-show="apotekOpen"
                class="ml-6 mt-2 space-y-1 border-l border-blue-600 pl-3"
              >
                <li>
                  <router-link
                    to="/medicine"
                    class="flex items-center p-2 rounded-lg hover:bg-blue-700"
                    active-class="bg-blue-600 shadow-md"
                    >Stok Obat</router-link
                  >
                </li>
                <li>
                  <router-link
                    to="/daftar-permintaan"
                    class="flex items-center p-2 rounded-lg hover:bg-blue-700"
                    active-class="bg-blue-600 shadow-md"
                    >Daftar Permintaan</router-link
                  >
                </li>
              </ul>
            </li>
          </template>

          <!-- Menu Apoteker -->
          <template v-if="role === 'apotek'">
            <li>
              <router-link
                to="/medicine"
                class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
                active-class="bg-blue-600 shadow-md"
                >Stok Obat</router-link
              >
            </li>
            <li>
              <router-link
                to="/daftar-permintaan"
                class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
                active-class="bg-blue-600 shadow-md"
                >Daftar Permintaan</router-link
              >
            </li>
          </template>
        </ul>
      </nav>
    </aside>

    <!-- Overlay mobile -->
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
        <header
          v-if="!needsFullLayout"
          class="flex justify-between items-center mb-6 border-b-4 border-blue-200 pb-3"
        >
          <div class="flex items-center">
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

const role = computed(() => authStore.userRole); // dinamis

const apotekOpen = ref(false);
const showSidebar = ref(false);
const isDesktop = ref(window.innerWidth >= 1024);

window.addEventListener("resize", () => {
  isDesktop.value = window.innerWidth >= 1024;
  if (isDesktop.value) showSidebar.value = false;
});

const needsFullLayout = computed(() => route.meta.fullLayout === true);

const handleLogout = () => {
  authStore.logout();
  router.push({ name: "Login" });
};

const pageTitle = computed(
  () => route.meta.documentTitle || "Manajemen Praktik dr. Johan"
);

onMounted(() => {
  if (!needsFullLayout.value && role.value === "admin") {
    store.fetchPatients();
  }
});
</script>
