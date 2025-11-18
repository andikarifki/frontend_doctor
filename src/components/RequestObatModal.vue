<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/axios"; // ganti axios biasa dengan instance

const showModal = ref(false);
const obat = ref([]);
const riwayat = ref([]);

// Ambil stok obat
const fetchObat = async () => {
  try {
    const res = await api.get("/stok-obat");
    if (res.data.success) obat.value = res.data.data;
  } catch (err) {
    console.error("Gagal mengambil stok obat:", err);
  }
};

// Ambil riwayat request
const fetchRiwayat = async () => {
  try {
    const res = await api.get("/request-obat-internal");
    if (res.data.success) {
      riwayat.value = res.data.data.map((r) => ({
        ...r,
        status: r.status.toLowerCase(),
      }));
    }
  } catch (err) {
    console.error("Gagal mengambil riwayat:", err);
  }
};

onMounted(() => {
  fetchObat();
  fetchRiwayat();
});

// Kirim request
const kirimRequest = async (payload) => {
  try {
    const res = await api.post("/request-obat-internal", payload);
    if (res.data.success) {
      alert("Permintaan berhasil dikirim");
      fetchRiwayat();
      showModal.value = false;
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat mengirim permintaan");
  }
};

// Cancel request
const cancelRequest = async (id) => {
  if (!confirm("Batalkan permintaan ini?")) return;
  try {
    await api.delete(`/request-obat-internal/${id}`);
    riwayat.value = riwayat.value.filter((r) => r.id !== id);
  } catch (err) {
    console.error(err);
    alert("Gagal membatalkan permintaan");
  }
};

// Warna status
const warnaStatus = (status) =>
  ({
    approved: "text-green-600",
    pending: "text-yellow-600",
    rejected: "text-red-600",
  }[status]);
</script>
