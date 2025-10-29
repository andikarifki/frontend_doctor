<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div
      class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-2xl"
    >
      <!-- Header Dokter -->
      <div class="flex items-center mb-6">
        <img
          src="https://img.okadoc.com/plain/200x200/photos/practitioner/photo/73503/okadoc-doctor-psychiatrist-johan-kurniawan-20200420165834.jpg"
          alt="Foto Dr. Johan"
          class="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-blue-400 mr-4"
        />
        <div>
          <h1 class="text-xl font-extrabold text-blue-700">dr. Johan</h1>
          <p class="text-sm text-blue-500">Spesialis Kedokteran Jiwa</p>
        </div>
      </div>

      <!-- Form Login -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Username -->
        <div>
          <label
            for="username"
            class="block text-sm font-semibold text-gray-700 mb-1"
            >Username</label
          >
          <input
            id="username"
            type="text"
            v-model="username"
            placeholder="Masukkan username Anda"
            required
            :disabled="authStore.loading"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
          />
        </div>

        <!-- Password -->
        <div class="relative">
          <label
            for="password"
            class="block text-sm font-semibold text-gray-700 mb-1"
            >Password</label
          >
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Masukkan password Anda"
            required
            :disabled="authStore.loading"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10 transition duration-150"
          />

          <!-- Icon mata -->
          <button
            type="button"
            @click="togglePassword"
            class="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition"
            tabindex="-1"
          >
            <svg
              v-if="!showPassword"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 
                010-.644C3.423 7.51 7.315 4.5 
                12 4.5c4.685 0 8.577 3.01 9.964 
                7.178a1.012 1.012 0 010 
                .644C20.577 16.49 16.685 19.5 12 
                19.5c-4.685 0-8.577-3.01-9.964-7.178z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 
                0z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 
                001.934 12C3.28 16.152 7.22 
                19.5 12 19.5c.958 0 
                1.887-.134 2.764-.383M9.88 
                9.88a3 3 0 104.24 4.24M6.228 
                6.228l11.544 11.544"
              />
            </svg>
          </button>
        </div>

        <!-- Tombol -->
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-2.5 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-150"
        >
          {{ authStore.loading ? "Sedang Memproses..." : "Login" }}
        </button>

        <p
          v-if="authStore.error"
          class="text-red-600 text-sm text-center mt-3 animate-pulse"
        >
          {{ authStore.error }}
        </p>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-center text-xs text-gray-400">
        <p>© 2025 Klinik dr. Johan. Semua hak dilindungi.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const username = ref("");
const password = ref("");
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  authStore.error = null;
  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    });
  } catch (err) {
    console.error("Percobaan login gagal", err);
  }
};
</script>
