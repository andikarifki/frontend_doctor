<template>
  <div class="dashboard p-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <!-- Card Total Pasien -->
      <div
        class="bg-white shadow-xl rounded-lg p-6 flex flex-col justify-between"
      >
        <div>
          <h3 class="text-gray-500 font-semibold text-sm">Total Pasien</h3>
          <p class="text-3xl font-bold text-blue-700">{{ totalPasien }}</p>
        </div>
        <router-link
          to="/pasien"
          class="mt-4 text-sm text-blue-600 hover:underline"
        >
          Lihat daftar pasien
        </router-link>
      </div>

      <!-- Card Total Praktik -->
      <div
        class="bg-white shadow-xl rounded-lg p-6 flex flex-col justify-between"
      >
        <div>
          <h3 class="text-gray-500 font-semibold text-sm">Total Praktik</h3>
          <p class="text-3xl font-bold text-green-700">{{ totalPraktik }}</p>
        </div>
        <router-link
          to="/praktik"
          class="mt-4 text-sm text-green-600 hover:underline"
        >
          Lihat daftar praktik
        </router-link>
      </div>

      <!-- Card Total Medical Record -->
      <div
        class="bg-white shadow-xl rounded-lg p-6 flex flex-col justify-between"
      >
        <div>
          <h3 class="text-gray-500 font-semibold text-sm">
            Total Medical Record
          </h3>
          <p class="text-3xl font-bold text-red-700">
            {{ totalMedicalRecord }}
          </p>
        </div>
        <router-link
          to="/medical-record"
          class="mt-4 text-sm text-red-600 hover:underline"
        >
          Lihat daftar medical record
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePasienStore } from "@/stores/pasienStore";
import { usePraktikStore } from "@/stores/praktikStore";
import { useMedicalRecordStore } from "../stores/medicalRecordStore";

const pasienStore = usePasienStore();
const praktikStore = usePraktikStore();
const medicalRecordStore = useMedicalRecordStore();

const totalPasien = ref(0);
const totalPraktik = ref(0);
const totalMedicalRecord = ref(0);

const fetchDashboardData = async () => {
  try {
    await pasienStore.fetchPatients();
    totalPasien.value = pasienStore.patients.length;

    await praktikStore.fetchPraktikList();
    totalPraktik.value = praktikStore.praktikList.length;

    await medicalRecordStore.fetchAllMedicalRecords();
    totalMedicalRecord.value = medicalRecordStore.allRecords.length;
  } catch (err) {
    console.error("Gagal fetch data dashboard:", err);
  }
};

onMounted(fetchDashboardData);
</script>
