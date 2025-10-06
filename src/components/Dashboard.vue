<template>
    <div class="overflow-x-auto shadow-lg rounded-lg border border-gray-200">

        <section class="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <button @click="goToCreatePage"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition text-sm">
                ➕ Tambah Pasien Baru
            </button>
            <button @click="handleLogout"
                class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition text-sm">
                🚪 Logout
            </button>
        </section>

        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-blue-800 text-white">
                <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                    <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Nama</th>
                    <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Tanggal Lahir</th>
                    <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-1/4">Riwayat & Aksi
                    </th>
                </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="loading && !patients.length">
                    <td colspan="5" class="px-4 py-4 text-center text-gray-500 italic">Memuat data...</td>
                </tr>
                <tr v-else-if="!patients.length && !loading">
                    <td colspan="5" class="px-4 py-4 text-center text-gray-500 italic">Belum ada data pasien.</td>
                </tr>

                <template v-for="pasien in patients" :key="pasien.id">

                    <tr v-if="editingId === pasien.id" class="bg-yellow-100 transition duration-100">
                        <td colspan="5" class="p-4 border-t-4 border-yellow-500">
                            <form @submit.prevent="submitEdit(pasien.id)"
                                class="space-y-3 p-4 border border-orange-400 rounded-lg bg-orange-50 shadow-inner">
                                <h5 class="text-md font-bold text-orange-700">✏️ Edit Pasien ID {{ pasien.id }}</h5>
                                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <input type="text" v-model="editForm.nama" required placeholder="Nama Pasien"
                                        class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm">
                                    <input type="date" v-model="editForm.tanggal" required
                                        class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm">
                                    <select v-model="editForm.status"
                                        class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm">
                                        <option value="Terdaftar">Terdaftar</option>
                                        <option value="Selesai">Selesai</option>
                                    </select>
                                    <div class="flex space-x-2">
                                        <button type="submit" :disabled="store.loading"
                                            class="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-3 rounded transition disabled:bg-gray-400 text-sm">
                                            Simpan
                                        </button>
                                        <button type="button" @click="editingId = null"
                                            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1.5 px-3 rounded transition text-sm">
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </td>
                    </tr>

                    <tr v-if="editingId !== pasien.id" :class="{ 'bg-blue-50': expandedId === pasien.id }"
                        class="hover:bg-indigo-50 transition duration-100">
                        <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ pasien.id }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ pasien.nama }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {{ pasien.tanggal ? pasien.tanggal.substring(0, 10) : '-' }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                            <span
                                :class="{ 'bg-green-100 text-green-800': pasien.status === 'Selesai', 'bg-yellow-100 text-yellow-800': pasien.status === 'Terdaftar' }"
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                {{ pasien.status }}
                            </span>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm flex justify-center items-center space-x-2">
                            <button @click="toggleRiwayat(pasien.id)"
                                class="text-indigo-600 hover:text-indigo-900 text-xs py-1 px-2 border border-indigo-600 rounded transition">
                                Riwayat ({{ pasien.medical_records.length }})
                            </button>
                            <button @click="handleEditPasien(pasien)"
                                class="bg-yellow-500 hover:bg-yellow-600 text-gray-800 text-xs py-1 px-2 rounded transition">
                                Edit
                            </button>
                            <button @click="handleDeleteConfirmation(pasien.id, pasien.nama)"
                                class="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded transition">
                                Hapus
                            </button>
                        </td>
                    </tr>

                    <tr v-if="expandedId === pasien.id" class="bg-gray-100 transition-all duration-300">
                        <td colspan="5" class="p-4 border-t-4 border-yellow-500">
                            <h4 class="font-semibold mb-3 text-lg text-gray-700">Riwayat Medis Pasien ID {{ pasien.id }}
                            </h4>

                            <button @click="toggleAddRecordForm(pasien.id)"
                                class="bg-orange-500 hover:bg-orange-600 text-white text-sm py-1.5 px-3 rounded transition mb-4">
                                {{ formVisibleId === pasien.id ? 'Sembunyikan Form' : '➕ Tambah Riwayat Medis Baru' }}
                            </button>

                            <form v-if="formVisibleId === pasien.id" @submit.prevent="submitMedis(pasien.id)"
                                class="space-y-3 p-4 mb-6 border border-yellow-400 rounded-lg bg-yellow-50 shadow-inner">
                                <h5 class="text-md font-bold text-orange-700">Input Riwayat Medis Baru</h5>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="date" v-model="medisForm.tanggal_periksa" required
                                        placeholder="Tanggal Periksa"
                                        class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm">
                                    <input type="text" v-model="medisForm.diagnosis" required
                                        placeholder="Diagnosis (ex: Demam Berdarah)"
                                        class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm">
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" v-model="medisForm.obat" required
                                        placeholder="Obat (ex: Paracetamol)"
                                        class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm">
                                    <input type="text" v-model="medisForm.lokasi_berobat" required
                                        placeholder="Lokasi Berobat (ex: Klinik Sehat Utama)"
                                        class="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm">
                                </div>
                                <button type="submit" :disabled="store.loading"
                                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded transition disabled:bg-gray-400 text-sm">
                                    Simpan Riwayat Medis
                                </button>
                            </form>

                            <div class="mt-4">
                                <ul v-if="pasien.medical_records.length" class="space-y-2">

                                    <li v-for="record in pasien.medical_records" :key="record.id"
                                        class="bg-white p-3 border-l-4 border-yellow-500 shadow-sm text-sm">

                                        <div v-if="editingRecordId !== record.id"
                                            class="flex justify-between items-start">
                                            <div>
                                                <strong class="text-gray-700">Diagnosis:</strong> {{ record.diagnosis }}
                                                |
                                                <strong class="text-gray-700">Tgl Periksa:</strong> {{
                                                    record.tanggal_periksa }} |
                                                <strong class="text-gray-700">Obat:</strong> {{ record.obat }} |
                                                <strong class="text-gray-700">Lokasi:</strong> {{ record.lokasi_berobat
                                                }}
                                            </div>
                                            <div class="flex space-x-2 ml-4">
                                                <button @click="handleEditRecord(record)"
                                                    class="bg-yellow-500 hover:bg-yellow-600 text-gray-800 text-xs py-1 px-2 rounded transition">
                                                    Edit
                                                </button>
                                                <button @click="handleDeleteRecord(record.id, pasien.id)"
                                                    class="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded transition">
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>

                                        <form v-else @submit.prevent="submitEditRecord(record.id)"
                                            class="space-y-2 p-3 border border-yellow-400 rounded-lg bg-yellow-50 shadow-inner">

                                            <h6 class="text-sm font-bold text-orange-700">✏️ Edit Riwayat ID {{
                                                record.id }}</h6>

                                            <input type="date" v-model="editRecordForm.tanggal_periksa" required
                                                class="block w-full border-gray-300 rounded-md shadow-sm p-1.5 text-xs">
                                            <input type="text" v-model="editRecordForm.diagnosis" required
                                                placeholder="Diagnosis"
                                                class="block w-full border-gray-300 rounded-md shadow-sm p-1.5 text-xs">
                                            <input type="text" v-model="editRecordForm.obat" required placeholder="Obat"
                                                class="block w-full border-gray-300 rounded-md shadow-sm p-1.5 text-xs">
                                            <input type="text" v-model="editRecordForm.lokasi_berobat" required
                                                placeholder="Lokasi Berobat"
                                                class="block w-full border-gray-300 rounded-md shadow-sm p-1.5 text-xs">

                                            <div class="flex space-x-2 pt-1">
                                                <button type="submit" :disabled="store.loading"
                                                    class="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded transition disabled:bg-gray-400 text-xs">
                                                    Simpan Perubahan
                                                </button>
                                                <button type="button" @click="editingRecordId = null"
                                                    class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded transition text-xs">
                                                    Batal
                                                </button>
                                            </div>
                                        </form>
                                    </li>
                                </ul>
                                <p v-else class="text-gray-500 italic">Belum ada riwayat medis.</p>
                            </div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePasienStore } from '@/stores/pasienStore';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';

const store = usePasienStore();
const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
    authStore.logout();
};

const { patients, loading } = storeToRefs(store);

// State lokal komponen
const expandedId = ref(null);
const formVisibleId = ref(null);
const editingId = ref(null);
const editForm = ref({ nama: '', tanggal: '', status: '' });
const medisForm = ref({
    tanggal_periksa: '', diagnosis: '', obat: '', lokasi_berobat: ''
});
const editingRecordId = ref(null);
const editRecordForm = ref({
    tanggal_periksa: '', diagnosis: '', obat: '', lokasi_berobat: ''
});

// ----------------------------------------------------
// FUNGSI NAVIGASI
// ----------------------------------------------------
const goToCreatePage = () => {
    router.push({ name: 'PasienCreate' });
};

// ----------------------------------------------------
// FUNGSI EDIT PASIEN (UPDATE)
// ----------------------------------------------------
const handleEditPasien = (pasien) => {
    if (editingId.value === pasien.id) {
        editingId.value = null;
        return;
    }
    editingId.value = pasien.id;
    // Memformat tanggal dari YYYY-MM-DDTHH:MM:SS menjadi YYYY-MM-DD
    const formattedDate = pasien.tanggal ? pasien.tanggal.substring(0, 10) : '';

    editForm.value = {
        nama: pasien.nama,
        tanggal: formattedDate,
        status: pasien.status
    };
    expandedId.value = null;
    formVisibleId.value = null;
};

const submitEdit = async (patientId) => {
    try {
        await store.updatePatient(patientId, editForm.value);
        editingId.value = null;
    } catch (error) {
        console.error("Gagal update pasien:", error);
    }
};

// ----------------------------------------------------
// FUNGSI RIWAYAT MEDIS & DELETE
// ----------------------------------------------------
const resetMedisForm = () => {
    medisForm.value = { tanggal_periksa: '', diagnosis: '', obat: '', lokasi_berobat: '' };
}

const toggleRiwayat = (id) => {
    editingId.value = null;
    resetMedisForm();
    formVisibleId.value = null;
    expandedId.value = expandedId.value === id ? null : id;
};

const toggleAddRecordForm = (id) => {
    if (formVisibleId.value === id) {
        formVisibleId.value = null;
        resetMedisForm();
    } else {
        formVisibleId.value = id;
        resetMedisForm();
    }
}

const submitMedis = async (patientId) => {
    const dataToSend = {
        pasien_id: patientId,
        ...medisForm.value
    };

    try {
        await store.addMedicalRecord(dataToSend);
        formVisibleId.value = null;
        resetMedisForm();
    } catch (error) {
        // Error handling dari store Pinia akan muncul di console/notifikasi
    }
};

const handleDeleteConfirmation = (id, nama) => {
    const confirmation = confirm(`[KONFIRMASI HAPUS] Anda yakin ingin menghapus Pasien: ${nama} (ID: ${id})?\n\nAksi ini akan menghapus SEMUA riwayat medis terkait dan TIDAK DAPAT DIBATALKAN.`);

    if (confirmation) {
        store.deletePatient(id);
    }
};

// 🟢 FUNGSI BARU: HANDLE EDIT RIWAYAT MEDIS (SUDAH DIPERBAIKI)
const handleEditRecord = (record) => {
    if (editingRecordId.value === record.id) {
        editingRecordId.value = null;
        return;
    }

    editingRecordId.value = record.id;

    // --- 🟢 PERBAIKAN: Format tanggal hanya YYYY-MM-DD ---
    const formattedDate = record.tanggal_periksa
        ? record.tanggal_periksa.substring(0, 10)
        : '';
    // --------------------------------------------------------

    // Isi form edit dengan data record saat ini
    editRecordForm.value = {
        tanggal_periksa: formattedDate, // Gunakan tanggal yang sudah diformat
        diagnosis: record.diagnosis,
        obat: record.obat,
        lokasi_berobat: record.lokasi_berobat,
    };
    // Pastikan form tambah riwayat baru tertutup
    formVisibleId.value = null;
};

// 🟢 FUNGSI BARU: SUBMIT EDIT RIWAYAT MEDIS
const submitEditRecord = async (recordId) => {
    try {
        await store.updateMedicalRecord(recordId, editRecordForm.value);
        editingRecordId.value = null; // Tutup form setelah berhasil
    } catch (error) {
        console.error("Gagal update riwayat medis:", error);
    }
};


// 🟢 FUNGSI BARU: HAPUS RIWAYAT MEDIS
const handleDeleteRecord = (recordId, patientId) => {
    const confirmation = confirm(`[KONFIRMASI HAPUS RIWAYAT MEDIS] Anda yakin ingin menghapus Riwayat Medis ID: ${recordId}?\n\nAksi ini TIDAK dapat dibatalkan.`);

    if (confirmation) {
        store.deleteMedicalRecord(recordId, patientId);
    }
};
</script>