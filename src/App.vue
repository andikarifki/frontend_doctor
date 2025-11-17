<template>
  <div class="min-h-screen bg-gray-100 flex">
    <Sidebar
      :showSidebar="showSidebar"
      :needsFullLayout="needsFullLayout"
      :isDesktop="isDesktop"
    />

    <div class="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div
        class="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl h-full"
        :class="{
          'max-w-md p-10': needsFullLayout,
          'p-6 sm:p-8': !needsFullLayout,
        }"
      >
        <!-- Header dengan emit -->
        <Header
          @toggleSidebar="showSidebar = !showSidebar"
          @logout="authStore.logout()"
        />

        <div :class="{ 'min-h-[70vh]': !needsFullLayout }">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";

const route = useRoute();
const authStore = useAuthStore();

const showSidebar = ref(false);
const isDesktop = ref(window.innerWidth >= 1024);

const needsFullLayout = computed(() => route.meta.fullLayout === true);

window.addEventListener("resize", () => {
  isDesktop.value = window.innerWidth >= 1024;
  if (isDesktop.value) showSidebar.value = false;
});

onMounted(() => {
  if (authStore.isAuthenticated && !authStore.user) {
    authStore.fetchUser();
  }
});
</script>
