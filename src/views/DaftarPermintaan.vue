<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Daftar Permintaan Obat</h2>

    <!-- TABEL PERMINTAAN -->
    <table class="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead class="bg-blue-600 text-white">
        <tr>
          <th class="p-2">ID</th>
          <th class="p-2">Dokter</th>
          <th class="p-2">Obat</th>
          <th class="p-2">Jumlah</th>
          <th class="p-2">Tanggal</th>
          <th class="p-2">Status</th>
          <th class="p-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="req in requests"
          :key="req.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="p-2 text-center">{{ req.id }}</td>
          <td class="p-2">{{ req.dokter }}</td>
          <td class="p-2">{{ req.obat }}</td>
          <td class="p-2 text-center">{{ req.jumlah }}</td>
          <td class="p-2">{{ req.tanggal }}</td>

          <td class="p-2">
            <span
              :class="{
                'px-2 py-1 rounded text-white bg-gray-500':
                  req.status === 'pending',
                'px-2 py-1 rounded text-white bg-green-600':
                  req.status === 'approved',
                'px-2 py-1 rounded text-white bg-red-600':
                  req.status === 'rejected',
              }"
            >
              {{ req.status }}
            </span>
          </td>

          <td class="p-2 flex gap-2 justify-center">
            <button
              class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              @click="approve(req.id)"
              :disabled="req.status !== 'pending'"
            >
              Approve
            </button>

            <button
              class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              @click="reject(req.id)"
              :disabled="req.status !== 'pending'"
            >
              Reject
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Total Pending -->
    <div class="mt-4 text-gray-700 font-semibold">
      Total request pending: {{ pendingCount }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// DUMMY DATA REQUEST OBAT
const requests = ref([
  {
    id: 1,
    dokter: "dr. Andi",
    obat: "Paracetamol",
    jumlah: 10,
    tanggal: "2025-11-15",
    status: "pending",
  },
  {
    id: 2,
    dokter: "dr. Budi",
    obat: "Amoxicillin",
    jumlah: 5,
    tanggal: "2025-11-15",
    status: "pending",
  },
  {
    id: 3,
    dokter: "dr. Sari",
    obat: "Vitamin C",
    jumlah: 20,
    tanggal: "2025-11-14",
    status: "approved",
  },
]);

// APPROVE REQUEST
const approve = (id) => {
  const req = requests.value.find((r) => r.id === id);
  if (req) req.status = "approved";
};

// REJECT REQUEST
const reject = (id) => {
  const req = requests.value.find((r) => r.id === id);
  if (req) req.status = "rejected";
};

// HITUNG JUMLAH REQUEST PENDING
const pendingCount = computed(
  () => requests.value.filter((r) => r.status === "pending").length
);
</script>

<style scoped>
table th,
table td {
  border-right: 1px solid #ddd;
}
table th:last-child,
table td:last-child {
  border-right: none;
}
</style>
