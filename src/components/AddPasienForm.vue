<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="apiMessage" :class="messageClass" class="p-3 rounded-lg font-medium">
            {{ apiMessage }}
            <ul v-if="validationErrors.length > 0" class="mt-2 list-disc list-inside">
                <li v-for="(error, index) in validationErrors" :key="index" class="text-sm">
                    {{ error }}
                </li>
            </ul>
        </div>

        <h3 class="text-xl font-semibold text-blue-700 border-b pb-2">Data Pasien</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label for="nama" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" id="nama" v-model="form.nama" required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
                <label for="tanggal" class="block text-sm font-medium text-gray-700">Tanggal</label>
                <input type="date" id="tanggal" v-model="form.tanggal" required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500">
            </div>
            
            <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" v-model="form.status" required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500">
                    <option value="" disabled selected>-- Pilih Status --</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                    <option value="Meninggal">Meninggal</option>
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
    // PERUBAHAN 2: Nilai default diubah menjadi string kosong agar placeholder terpilih
    status: '', 
});

// State untuk feedback API
const apiMessage = ref(null);
const validationErrors = ref([]); 

// Kelas dinamis untuk styling feedback
const messageClass = computed(() => {
    if (store.apiError || validationErrors.value.length > 0) {
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
        // PERUBAHAN 3: Reset status ke string kosong
        status: '', 
    };
    validationErrors.value = [];
};

// Handler ketika formulir disubmit
const handleSubmit = async () => {
    // Reset pesan dan error
    apiMessage.value = null;
    store.apiError = null;
    store.apiResponse = null;
    validationErrors.value = []; 

    try {
        await store.addPatient(form.value);

        // Set pesan sukses
        const responseData = store.apiResponse.data;
        apiMessage.value = responseData.message || "Pasien berhasil ditambahkan!";

        resetForm();

    } catch (error) {
        // Pesan error umum
        apiMessage.value = store.apiError || "Terjadi kesalahan saat menyimpan data.";
        
        // Penanganan Error Validasi (Status 422)
        if (error && error.response && error.response.status === 422) {
            const errors = error.response.data.errors;
            const messages = [];
            
            for (const key in errors) {
                if (errors.hasOwnProperty(key)) {
                    messages.push(errors[key][0]); 
                }
            }
            validationErrors.value = messages;
            apiMessage.value = "Validasi Gagal! Periksa kembali data masukan Anda.";
        }
    }
};
</script>