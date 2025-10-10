<template>
    <div class="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">

        <h2 class="text-3xl font-bold text-gray-800 text-center mb-6">Masuk ke Akun Anda</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">

            <!-- Email -->
            <div class="form-group">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input id="email" type="email" v-model="email" placeholder="Masukkan email Anda" required
                    :disabled="authStore.loading"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150">
            </div>

            <!-- Password + Eye Toggle -->
            <div class="form-group relative">
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>

                <input id="password" :type="showPassword ? 'text' : 'password'" v-model="password"
                    placeholder="Masukkan password Anda" required :disabled="authStore.loading"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 pr-10">

                <!-- Tombol mata -->
                <button type="button" @click="togglePassword"
                    class="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none" tabindex="-1">
                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.315 4.5 12 4.5c4.685 0 8.577 3.01 9.964 7.178a1.012 1.012 0 010 .644C20.577 16.49 16.685 19.5 12 19.5c-4.685 0-8.577-3.01-9.964-7.178z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.28 16.152 7.22 19.5 12 19.5c.958 0 1.887-.134 2.764-.383M9.88 9.88a3 3 0 104.24 4.24M6.228 6.228l11.544 11.544M9.88 9.88L6.228 6.228" />
                    </svg>
                </button>
            </div>

            <!-- Tombol Login -->
            <button type="submit" :disabled="authStore.loading"
                class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150">
                {{ authStore.loading ? 'Sedang Memproses...' : 'Login' }}
            </button>

            <p v-if="authStore.error" class="text-red-600 text-sm text-center mt-3">
                {{ authStore.error }}
            </p>

        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const showPassword = ref(false);

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
    authStore.error = null;

    try {
        await authStore.login({
            email: email.value,
            password: password.value
        });
    } catch (err) {
        console.error("Percobaan login gagal", err);
    }
};
</script>
