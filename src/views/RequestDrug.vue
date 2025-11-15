<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Request Obat Dokter</h1>

    <!-- FORM REQUEST -->
    <div class="bg-white p-4 shadow rounded mb-6">
      <h2 class="font-semibold mb-3">Tambah Permintaan Obat</h2>

      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-2">
          <label class="block mb-1">Pilih Obat</label>
          <select
            v-model="selectedObat"
            class="border rounded w-full px-2 py-1"
          >
            <option value="">-- Pilih Obat --</option>
            <option v-for="o in obat" :key="o.id" :value="o.id">
              {{ o.nama }} (stok: {{ o.stok }} {{ o.satuan }})
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-1">Jumlah</label>
          <input
            type="number"
            v-model="jumlah"
            min="1"
            class="border rounded w-full px-2 py-1"
          />
        </div>
      </div>

      <button
        @click="tambahItem"
        class="mt-3 bg-blue-600 text-white px-4 py-1 rounded"
      >
        Tambah
      </button>
    </div>

    <!-- TABEL PERMINTAAN -->
    <div class="bg-white p-4 shadow rounded mb-6">
      <h2 class="font-semibold mb-3">Daftar Permintaan</h2>

      <table class="w-full border">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-2 py-1">Obat</th>
            <th class="border px-2 py-1">Jumlah</th>
            <th class="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in daftar" :key="i">
            <td class="border px-2 py-1">{{ item.nama }}</td>
            <td class="border px-2 py-1">{{ item.jumlah }}</td>
            <td class="border px-2 py-1 text-center">
              <button @click="hapusItem(i)" class="text-red-600">Hapus</button>
            </td>
          </tr>

          <tr v-if="daftar.length === 0">
            <td colspan="3" class="text-center py-3 text-gray-500">
              Belum ada item.
            </td>
          </tr>
        </tbody>
      </table>

      <button
        v-if="daftar.length"
        @click="kirimRequest"
        class="mt-3 bg-green-600 text-white px-4 py-1 rounded"
      >
        Kirim Permintaan
      </button>
    </div>

    <!-- RIWAYAT PERMINTAAN -->
    <div class="bg-white p-4 shadow rounded">
      <h2 class="font-semibold mb-3">Riwayat Permintaan</h2>

      <table class="w-full border">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-2 py-1">Tanggal</th>
            <th class="border px-2 py-1">Jumlah Item</th>
            <th class="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in riwayat" :key="r.id">
            <td class="border px-2 py-1">{{ r.tanggal }}</td>
            <td class="border px-2 py-1">{{ r.jumlah_item }}</td>
            <td
              class="border px-2 py-1 font-semibold"
              :class="warnaStatus(r.status)"
            >
              {{ r.status.toUpperCase() }}
            </td>
          </tr>

          <tr v-if="riwayat.length === 0">
            <td colspan="3" class="text-center py-3 text-gray-500">
              Riwayat kosong.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // MOCK DATA OBAT
      obat: [
        { id: 1, nama: "Paracetamol", stok: 120, satuan: "tablet" },
        { id: 2, nama: "Amoxicillin", stok: 75, satuan: "kapsul" },
        { id: 3, nama: "Vitamin C", stok: 50, satuan: "tablet" },
      ],

      // MOCK DATA RIWAYAT
      riwayat: [
        { id: 301, tanggal: "2025-11-10", jumlah_item: 2, status: "approved" },
        { id: 302, tanggal: "2025-11-12", jumlah_item: 1, status: "pending" },
        { id: 303, tanggal: "2025-11-13", jumlah_item: 3, status: "rejected" },
      ],

      selectedObat: "",
      jumlah: "",
      daftar: [],
    };
  },

  methods: {
    tambahItem() {
      if (!this.selectedObat || !this.jumlah) {
        alert("Pilih obat dan jumlahnya.");
        return;
      }

      const obat = this.obat.find((o) => o.id == this.selectedObat);

      this.daftar.push({
        id: obat.id,
        nama: obat.nama,
        jumlah: this.jumlah,
      });

      this.selectedObat = "";
      this.jumlah = "";
    },

    hapusItem(i) {
      this.daftar.splice(i, 1);
    },

    kirimRequest() {
      // DISINI nanti kamu sambungkan ke API
      alert("Permintaan berhasil dikirim.");

      // contoh push data baru sebagai riwayat
      this.riwayat.unshift({
        id: Date.now(),
        tanggal: new Date().toISOString().split("T")[0],
        jumlah_item: this.daftar.length,
        status: "pending",
      });

      this.daftar = [];
    },

    warnaStatus(status) {
      return {
        approved: "text-green-600",
        pending: "text-yellow-600",
        rejected: "text-red-600",
      }[status];
    },
  },
};
</script>
