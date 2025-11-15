import { createRouter, createWebHistory } from "vue-router";
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

const isAuthenticated = () => localStorage.getItem("authToken") !== null;

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false, fullLayout: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true, documentTitle: "Dashboard", fullLayout: false },
  },
  {
    path: "/pasien",
    name: "Pasien",
    component: Pasien,
    meta: { requiresAuth: true, documentTitle: "Daftar Pasien", fullLayout: false },
  },
  {
    path: "/pasien/create",
    name: "PasienCreate",
    component: PasienCreatePage,
    meta: { requiresAuth: true, tdocumentTitle: "Daftar Pasien", fullLayout: false },
  },
    {
    path: "/pasien/detail-pasien/:id",
    name: "DetailPasien",
    component: DetailPasien,
    meta: { requiresAuth: true, documentTitle: "Detail Pasien", fullLayout: false },
  },
  {
    path: "/praktik",
    name: "Praktik",
    component: Praktik,
    meta: { requiresAuth: true, documentTitle: "Daftar Praktik", fullLayout: false },
  },
  {
    path: "/pasien-praktik",
    name: "PasienPraktik",
    component: PasienPraktik,
    meta: { requiresAuth: true, documentTitle: "Daftar Pasien Berobat", fullLayout: false },
  },
   {
    path: "/pasien-praktik/tambah",
    name: "CreatePraktikPasien",
    component: CreatePraktikPasien,
    meta: { requiresAuth: true, documentTitle: "Cari Nama Pasien", fullLayout: false },
  },
  {
    path: "/medical-record",
    name: "MedicalRecord",
    component: MedicalRecord,
    meta: { requiresAuth: true, documentTitle: "Daftar Rekam Medis Pasien", fullLayout: false },
  },
  {
    path: "/medicine",
    name: "Medicine",
    component: Medicine,
    meta: { requiresAuth: true, documentTitle: "Menu Obat", fullLayout: false },
  },
  {
    path: "/request-drug",
    name: "RequestDrug",
    component: RequestDrug,
    meta: { requiresAuth: true, documentTitle: "Menu Request Obat", fullLayout: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = isAuthenticated();

  if (to.name === "Login" && loggedIn) {
    return next({ name: "Dashboard" });
  }

  if (to.meta.requiresAuth && !loggedIn) {
    return next({ name: "Login" });
  }

  next();
});

router.afterEach((to) => {
  const baseTitle = "Manajemen Praktik dr. Johan";
  document.title = to.meta.title
    ? `${to.meta.title} | ${baseTitle}`
    : baseTitle;
});

export default router;
