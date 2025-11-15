<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">
      Stok Obat & Permintaan Dokter (Dummy)
    </h1>

    <!-- ===================== -->
    <!--  BAGIAN STOK OBAT     -->
    <!-- ===================== -->
    <h2 class="text-xl font-semibold mt-4 mb-2">Stok Obat (Dummy)</h2>

    <table class="w-full border mb-8">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 border">Obat</th>
          <th class="p-2 border">Stok</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ob in stokObat" :key="ob.id">
          <td class="p-2 border">{{ ob.nama }}</td>
          <td class="p-2 border">{{ ob.stok }}</td>
        </tr>
      </tbody>
    </table>

    <button
      @click="kirimRequestDariDokter"
      class="bg-blue-600 text-white px-4 py-2 rounded mb-6"
    >
      Simulasi Dokter Kirim Request
    </button>

    <!-- ===================== -->
    <!--  DAFTAR PERMINTAAN    -->
    <!-- ===================== -->
    <h2 class="text-xl font-semibold mb-3">Daftar Permintaan Obat</h2>

    <table class="w-full border">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 border">Dokter</th>
          <th class="p-2 border">Obat</th>
          <th class="p-2 border">Jumlah</th>
          <th class="p-2 border">Status</th>
          <th class="p-2 border">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="req in requests" :key="req.id">
          <td class="p-2 border">{{ req.dokter }}</td>
          <td class="p-2 border">{{ req.obat }}</td>
          <td class="p-2 border">{{ req.jumlah }}</td>
          <td class="p-2 border">
            <span
              :class="{
                'text-yellow-600': req.status === 'pending',
                'text-green-600': req.status === 'disetujui',
                'text-red-600': req.status === 'ditolak',
              }"
            >
              {{ req.status }}
            </span>
          </td>

          <td class="p-2 border space-x-2">
            <button
              v-if="req.status === 'pending'"
              @click="setujuiRequest(req)"
              class="bg-green-600 text-white px-3 py-1 rounded"
            >
              Setujui
            </button>

            <button
              v-if="req.status === 'pending'"
              @click="tolakRequest(req)"
              class="bg-red-600 text-white px-3 py-1 rounded"
            >
              Tolak
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from "vue";

// =========================
//  DUMMY STOK OBAT
// =========================
const stokObat = ref([
  { id: 1, nama: "Paracetamol 500mg", stok: 25 },
  { id: 2, nama: "Amoxicillin 500mg", stok: 50 },
  { id: 3, nama: "Vitamin C 500mg", stok: 40 },
]);

// =========================
//  DUMMY REQUEST
// =========================
const requests = ref([
  {
    id: 1,
    dokter: "dr. Sinta",
    obat: "Paracetamol 500mg",
    jumlah: 3,
    status: "pending",
  },
]);

// =========================
//  DOKTER KIRIM OTOMATIS
// =========================
const kirimRequestDariDokter = () => {
  const daftarObat = stokObat.value;
  const randomObat = daftarObat[Math.floor(Math.random() * daftarObat.length)];

  const contohRequest = {
    id: Date.now(),
    dokter: "dr. Budi",
    obat: randomObat.nama,
    jumlah: Math.floor(Math.random() * 5) + 1,
    status: "pending",
  };

  requests.value.push(contohRequest);
};

// =========================
//  SETUJUI REQUEST
// =========================
const setujuiRequest = (req) => {
  const obat = stokObat.value.find((o) => o.nama === req.obat);

  if (!obat) {
    alert("Obat tidak ditemukan!");
    return;
  }

  if (obat.stok < req.jumlah) {
    alert("Stok tidak cukup!");
    req.status = "ditolak";
    return;
  }

  obat.stok -= req.jumlah;
  req.status = "disetujui";
};

// =========================
//  TOLAK REQUEST
// =========================
const tolakRequest = (req) => {
  req.status = "ditolak";
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
