<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="apiMessage" :class="messageClass" class="p-3 rounded-lg font-medium">
            {{ apiMessage }}
        </div>

        <h3 class="text-xl font-semibold text-blue-700 border-b pb-2">Data Pasien</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="nama" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" id="nama" v-model="form.nama" required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
                <label for="tanggal" class="block text-sm font-medium text-gray-700">Tanggal Pendaftaran</label>
                <input type="date" id="tanggal" v-model="form.tanggal" required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" v-model="form.status" required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Terdaftar">Terdaftar</option>
                    <option value="Selesai">Selesai</option>
                </select>
            </div>
        </div>

        <div class="pt-4 border-t">
            <button type="submit" :disabled="store.loading"
                class="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 transition">
                {{ store.loading ? 'Memproses...' : 'Simpan Data Pasien' }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePasienStore } from '@/stores/pasienStore';

const store = usePasienStore();

// State formulir
const form = ref({
    nama: '',
    tanggal: new Date().toISOString().substring(0, 10), // Default hari ini
    status: 'Terdaftar',
});

// State untuk feedback API
const apiMessage = ref(null);

// Kelas dinamis untuk styling feedback
const messageClass = computed(() => {
    if (store.apiError) {
        return 'bg-red-100 text-red-700 border border-red-400';
    }
    if (store.apiResponse && store.apiResponse.status && store.apiResponse.status < 400) {
        return 'bg-green-100 text-green-700 border border-green-400';
    }
    return '';
});

// Fungsi untuk mereset formulir
const resetForm = () => {
    form.value = {
        nama: '',
        tanggal: new Date().toISOString().substring(0, 10),
        status: 'Terdaftar',
    };
};

// Handler ketika formulir disubmit
const handleSubmit = async () => {
    // Reset pesan
    apiMessage.value = null;
    store.apiError = null;
    store.apiResponse = null;

    try {
        // Panggil action Pinia
        await store.addPatient(form.value);

        // Set pesan sukses dari response Pinia
        const responseData = store.apiResponse.data;
        apiMessage.value = responseData.message || "Pasien berhasil ditambahkan!";

        // Reset formulir setelah sukses
        resetForm();

    } catch (error) {
        // Pesan error sudah di-handle dan disimpan di store.apiError
        apiMessage.value = store.apiError || "Terjadi kesalahan saat menyimpan data.";
    }
};
</script>