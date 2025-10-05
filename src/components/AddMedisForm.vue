<template>
    <form @submit.prevent="submitMedis" class="space-y-4 p-4 border border-blue-300 rounded-lg bg-blue-50">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-group">
                <label for="pasien_id" class="block text-sm font-medium text-gray-700">ID Pasien:</label>
                <input type="number" v-model.number="form.pasien_id" required min="1" placeholder="Masukkan ID Pasien"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div class="form-group">
                <label for="tanggal_periksa" class="block text-sm font-medium text-gray-700">Tanggal Berobat
                    (YYYY-MM-DD):</label>
                <input type="date" v-model="form.tanggal_periksa" required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="form-group">
                <label for="diagnosis" class="block text-sm font-medium text-gray-700">Diagnosis:</label>
                <input type="text" v-model="form.diagnosis" required placeholder="Contoh: Demam Berdarah"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div class="form-group">
                <label for="obat" class="block text-sm font-medium text-gray-700">Obat:</label>
                <input type="text" v-model="form.obat" required placeholder="Contoh: Paracetamol, Antibiotik"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div class="form-group">
                <label for="lokasi_berobat" class="block text-sm font-medium text-gray-700">Lokasi Berobat:</label>
                <input type="text" v-model="form.lokasiberobat" required placeholder="Contoh: Klinik Sehat Utama"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
            </div>
        </div>

        <button type="submit" :disabled="store.loading"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-400">
            Kirim Riwayat Medis
        </button>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { usePasienStore } from '@/stores/pasienStore';

const store = usePasienStore();
const form = ref({
    pasien_id: null,
    diagnosis: '',
    tanggal_periksa: '',
    obat: '',
    lokasi_berobat: ''
});

const submitMedis = () => {
    store.addMedicalRecord(form.value);
    // Reset form setelah kirim
    form.value = { pasien_id: null, diagnosis: '', tanggal_periksa: '', obat: '', lokasi_berobat: '' };
};
</script>