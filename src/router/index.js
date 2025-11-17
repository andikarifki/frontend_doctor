import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Pages
import Login from "../components/Login.vue";
import PasienCreatePage from "../views/PasienCreatePage.vue";
import Praktik from "../views/Praktik.vue";
import Dashboard from "../views/Dashboard.vue";
import DetailPasien from "../views/DetailPasien.vue";
import PasienPraktik from "../views/PasienPraktik.vue";
import CreatePraktikPasien from "../views/CreatePraktikPasien.vue";
import MedicalRecord from "../views/MedicalRecord.vue";
import Medicine from "../views/Medicine.vue";
import RequestDrug from "../views/RequestDrug.vue";
import Pasien from "../views/Pasien.vue";
import DaftarPermintaan from "../views/DaftarPermintaan.vue";
import CreateObat from "../views/CreateObat.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false, fullLayout: true },
  },

  // Dashboard
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true, documentTitle: "Halaman Utama" },
  },

  // Pasien
  {
    path: "/pasien",
    name: "Pasien",
    component: Pasien,
    meta: { requiresAuth: true, documentTitle: "Daftar Pasien" },
  },
  {
    path: "/pasien/create",
    name: "PasienCreate",
    component: PasienCreatePage,
    meta: { requiresAuth: true, documentTitle: "Tambah Pasien" },
  },
  {
    path: "/pasien/detail-pasien/:id",
    name: "DetailPasien",
    component: DetailPasien,
    meta: { requiresAuth: true, documentTitle: "Detail Pasien" },
  },

  // Praktik
  {
    path: "/praktik",
    name: "Praktik",
    component: Praktik,
    meta: { requiresAuth: true, documentTitle: "Daftar Praktik" },
  },
  {
    path: "/pasien-praktik",
    name: "PasienPraktik",
    component: PasienPraktik,
    meta: { requiresAuth: true, documentTitle: "Daftar Pasien Berobat" },
  },
  {
    path: "/pasien-praktik/tambah",
    name: "CreatePraktikPasien",
    component: CreatePraktikPasien,
    meta: { requiresAuth: true, documentTitle: "Tambah Pasien Praktik" },
  },

  // Rekam Medis
  {
    path: "/medical-record",
    name: "MedicalRecord",
    component: MedicalRecord,
    meta: { requiresAuth: true, documentTitle: "Rekam Medis" },
  },

  // Obat
  {
    path: "/medicine",
    name: "Medicine",
    component: Medicine,
    meta: { requiresAuth: true, documentTitle: "Stok Obat" },
  },
  {
    path: "/medicine/tambah",
    name: "MedicineTambah",
    component: CreateObat,
    meta: { requiresAuth: true, documentTitle: "Tambah Obat" },
  },
  {
    path: "/daftar-permintaan",
    name: "DaftarPermintaan",
    component: DaftarPermintaan,
    meta: { requiresAuth: true, documentTitle: "Daftar Permintaan" },
  },
  {
    path: "/request-drug",
    name: "RequestDrug",
    component: RequestDrug,
    meta: { requiresAuth: true, documentTitle: "Request Obat" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ===================
// 🌟 Navigation Guard
// ===================

router.beforeEach((to, from, next) => {
  const auth = useAuthStore(); // langsung ambil Pinia
  const loggedIn = auth.isAuthenticated;
  const role = auth.userRole;

  // Jika user sudah login tapi buka halaman login
  if (to.name === "Login" && loggedIn) {
    return next({ name: "Dashboard" });
  }

  // Jika rute butuh login tapi tidak login
  if (to.meta.requiresAuth && !loggedIn) {
    return next({ name: "Login" });
  }

  // Role: Apotek → hanya boleh akses route tertentu
  const apotekRoutes = ["Medicine", "MedicineTambah", "DaftarPermintaan"];
  if (role === "apotek" && !apotekRoutes.includes(to.name)) {
    return next({ name: "Medicine" });
  }

  next();
});

// ===================
// 🌟 Auto Page Title
// ===================

router.afterEach((to) => {
  const base = "Manajemen Praktik dr. Johan";
  document.title = to.meta.documentTitle
    ? `${to.meta.documentTitle} | ${base}`
    : base;
});

export default router;
