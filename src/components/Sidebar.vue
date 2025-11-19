<template>
  <aside
    v-if="!needsFullLayout"
    class="fixed inset-y-0 left-0 bg-blue-800 text-white p-4 shadow-2xl z-50 transform transition-all duration-300 lg:relative lg:translate-x-0 flex flex-col"
    :class="[
      { '-translate-x-full': !showSidebar && !isDesktop },
      collapsed ? 'w-20' : 'w-64',
    ]"
  >
    <!-- Tombol Collapse (Desktop) -->
    <button
      @click="collapsed = !collapsed"
      class="absolute -right-3 top-6 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow cursor-pointer hidden lg:flex"
    >
      {{ collapsed ? ">" : "<" }}
    </button>

    <!-- Profil -->
    <div class="mb-8 p-2" v-show="!collapsed">
      <div class="flex items-center">
        <div class="text-left">
          <h1 class="text-xl font-extrabold text-blue-100">
            {{ authStore.user?.name || "User" }}
          </h1>
          <p class="text-blue-300 text-xs mt-1 capitalize">
            {{ role }}
          </p>
        </div>
      </div>

      <div class="mt-4 border-b border-blue-600 pb-2"></div>
    </div>

    <!-- Menu -->
    <nav class="flex-1 overflow-auto">
      <h2
        class="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wider"
        v-show="!collapsed"
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
            >
              <span>📊</span>
              <span class="ml-3" v-show="!collapsed">Halaman Utama</span>
            </router-link>
          </li>

          <li>
            <router-link
              to="/pasien"
              class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <span>🧑‍⚕️</span>
              <span class="ml-3" v-show="!collapsed">Pasien</span>
            </router-link>
          </li>

          <li>
            <router-link
              to="/praktik"
              class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <span>📅</span>
              <span class="ml-3" v-show="!collapsed">Daftar Praktik</span>
            </router-link>
          </li>

          <li>
            <router-link
              to="/pasien-praktik"
              class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <span>📃</span>
              <span class="ml-3" v-show="!collapsed"
                >Daftar Pasien Berobat</span
              >
            </router-link>
          </li>

          <li>
            <router-link
              to="/medical-record"
              class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <span>📚</span>
              <span class="ml-3" v-show="!collapsed">Riwayat Medis</span>
            </router-link>
          </li>

          <li>
            <router-link
              to="/request-drug"
              class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <span>💊</span>
              <span class="ml-3" v-show="!collapsed">Request Obat</span>
            </router-link>
          </li>

          <!-- Submenu Apoteker -->
          <li>
            <button
              @click="apotekOpen = !apotekOpen"
              class="flex items-center w-full p-3 rounded-lg hover:bg-blue-700"
            >
              <span>🏥</span>
              <span class="ml-3" v-show="!collapsed">Apoteker</span>

              <span class="ml-auto text-sm" v-show="!collapsed">
                {{ apotekOpen ? "▲" : "▼" }}
              </span>
            </button>

            <ul
              v-show="apotekOpen && !collapsed"
              class="ml-6 mt-2 space-y-1 border-l border-blue-600 pl-3"
            >
              <li>
                <router-link
                  to="/medicine"
                  class="flex items-center p-2 rounded-lg hover:bg-blue-700"
                  active-class="bg-blue-600 shadow-md"
                >
                  <span>💼</span>
                  <span class="ml-2">Stok Obat</span>
                </router-link>
              </li>

              <li>
                <router-link
                  to="/daftar-permintaan"
                  class="flex items-center p-2 rounded-lg hover:bg-blue-700"
                  active-class="bg-blue-600 shadow-md"
                >
                  <span>📦</span>
                  <span class="ml-2">Daftar Permintaan</span>
                </router-link>
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
            >
              <span>📦</span>
              <span class="ml-3" v-show="!collapsed">Stok Obat</span>
            </router-link>
          </li>

          <li>
            <router-link
              to="/daftar-permintaan"
              class="flex items-center p-3 rounded-lg text-blue-100 hover:bg-blue-700"
              active-class="bg-blue-600 shadow-md"
            >
              <span>📨</span>
              <span class="ml-3" v-show="!collapsed">Daftar Permintaan</span>
            </router-link>
          </li>
        </template>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  showSidebar: Boolean,
  needsFullLayout: Boolean,
  isDesktop: Boolean,
});

// STORE
const authStore = useAuthStore();
const role = computed(() => authStore.userRole);

// STATES
const apotekOpen = ref(false);
const collapsed = ref(false);
</script>
