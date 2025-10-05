<template>
    <form @submit.prevent="submitPasien" class="space-y-4 p-4 border border-green-300 rounded-lg bg-green-50">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="form-group">
                <label for="nama" class="block text-sm font-medium text-gray-700">Nama Pasien:</label>
                <input type="text" v-model="form.nama" required placeholder="Contoh: Budi Santoso"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div class="form-group">
                <label for="tanggal" class="block text-sm font-medium text-gray-700">Tgl. Daftar/Lahir:</label>
                <input type="date" v-model="form.tanggal" required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div class="form-group">
                <label for="status" class="block text-sm font-medium text-gray-700">Status:</label>
                <select v-model="form.status" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
                    <option value="Terdaftar">Terdaftar</option>
                    <option value="Selesai">Selesai</option>
                </select>
            </div>
            <div class="form-group flex items-end">
                <button type="submit" :disabled="store.loading"
                    class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition w-full disabled:bg-gray-400">
                    Kirim Data Pasien
                </button>
            </div>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { usePasienStore } from '@/stores/pasienStore';

const store = usePasienStore();
const form = ref({ nama: '', tanggal: '', status: 'Terdaftar' });

const submitPasien = () => {
    store.addPatient(form.value);
    form.value = { nama: '', tanggal: '', status: 'Terdaftar' };
};
</script>