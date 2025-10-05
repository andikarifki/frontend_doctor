import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Dashboard from "../components/Dashboard.vue";
import PasienCreatePage from "../views/PasienCreatePage.vue";

// Fungsi pengecekan otentikasi dummy
// NANTINYA: Ganti ini dengan pengecekan Token di Local Storage!
const isAuthenticated = () => {
  return localStorage.getItem("authToken") !== null;
};

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    // Middleware untuk melindungi route
    meta: { requiresAuth: true },
  },
  {
    // 🟢 Rute Halaman Tambah Pasien
    path: "/pasien/create",
    name: "PasienCreate", // Digunakan oleh goToCreatePage di Dashboard.vue
    component: PasienCreatePage,
  },
];

const router = createRouter({
  // Gunakan history mode untuk URL yang bersih (tanpa '#')
  history: createWebHistory(),
  routes,
});

// Navigation Guard (Global Middleware)
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // Jika route memerlukan otentikasi DAN pengguna belum login
    next({ name: "Login" }); // Arahkan ke halaman Login
  } else {
    next(); // Lanjutkan ke route tujuan
  }
});

export default router;
