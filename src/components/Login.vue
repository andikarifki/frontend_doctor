<template>
    <div class="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">

        <h2 class="text-3xl font-bold text-gray-800 text-center mb-6">Masuk ke Akun Anda</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">

            <div class="form-group">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input id="email" type="email" v-model="email" placeholder="Masukkan email Anda" required
                    :disabled="authStore.loading"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150">
            </div>

            <div class="form-group">
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input id="password" type="password" v-model="password" placeholder="Masukkan password Anda" required
                    :disabled="authStore.loading"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150">
            </div>

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