<template>
    <div class="login-container">
        <h2>Masuk ke Akun Anda</h2>

        <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" v-model="email" placeholder="Masukkan email Anda" required
                    :disabled="authStore.loading">
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input id="password" type="password" v-model="password" placeholder="Masukkan password Anda" required
                    :disabled="authStore.loading">
            </div>

            <button type="submit" :disabled="authStore.loading" class="btn-primary">
                {{ authStore.loading ? 'Sedang Memproses...' : 'Login' }}
            </button>

            <p v-if="authStore.error" class="error-message">
                {{ authStore.error }}
            </p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
// Import Store yang berisi logika API Laravel Sanctum
import { useAuthStore } from '@/stores/auth';

// Akses Pinia Store
const authStore = useAuthStore();

// State lokal untuk menyimpan input form
const email = ref('');
const password = ref('');

// Fungsi yang dipanggil saat form disubmit
const handleLogin = async () => {
    // Reset error di store sebelum mencoba login
    authStore.error = null;

    try {
        // Panggil action 'login' di Pinia Store
        // Pinia Store akan menangani: 
        // 1. Panggilan API Laravel
        // 2. Penyimpanan Token Sanctum
        // 3. Redirect ke /dashboard
        await authStore.login({
            email: email.value,
            password: password.value
        });

        // Catatan: Jika login berhasil, redirect terjadi di dalam action authStore.login()

    } catch (err) {
        // Error ditangani di Pinia Store, kita hanya log jika perlu
        console.error("Percobaan login gagal", err);
    }
};
</script>

<style scoped>
/* Styling sederhana (Anda bisa menambahkan sesuai preferensi) */
.login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 15px;
    text-align: left;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    /* Pastikan padding tidak menambah lebar */
}

.btn-primary {
    padding: 10px;
    background-color: #3490dc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}

.btn-primary:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
}

.error-message {
    color: red;
    margin-top: 15px;
    text-align: center;
}
</style>