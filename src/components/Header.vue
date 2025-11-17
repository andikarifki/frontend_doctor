<template>
  <header
    v-if="!needsFullLayout"
    class="flex justify-between items-center mb-6 border-b-4 border-blue-200 pb-3"
  >
    <div class="flex items-center">
      <button @click="$emit('toggleSidebar')" class="lg:hidden mr-3">☰</button>
      <h1 class="text-2xl font-extrabold text-blue-800">{{ pageTitle }}</h1>
    </div>
    <button
      @click="$emit('logout')"
      class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition text-sm"
    >
      🚪 Logout
    </button>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const pageTitle = computed(
  () => route.meta.documentTitle || "Manajemen Praktik dr. Johan"
);
const needsFullLayout = computed(() => route.meta.fullLayout === true);
</script>
