<template>
    <div class="p-8 bg-white rounded-xl shadow-lg text-center max-w-2xl mx-auto">

        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">
            Selamat Datang di Vue Sanctum App!
        </h1>

        <p class="text-lg text-gray-600 mb-6">
            Ini adalah halaman publik utama. Untuk mengakses area terlarang dan fitur aplikasi lainnya, Anda perlu
            login.
        </p>

        <p class="text-base">
            Silakan
            <router-link to="/login"
                class="text-blue-600 hover:text-blue-800 font-semibold underline transition duration-150">
                Login
            </router-link>
            untuk melihat Dashboard Anda.
        </p>

    </div>
</template>

<script setup>
// Gunakan <script setup> karena komponen ini sederhana dan tidak memerlukan export default
</script>