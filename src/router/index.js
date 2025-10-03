import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Login from "../components/Login.vue";
import Dashboard from "../components/Dashboard.vue";

// Fungsi pengecekan otentikasi dummy
// NANTINYA: Ganti ini dengan pengecekan Token di Local Storage!
const isAuthenticated = () => {
  return localStorage.getItem("authToken") !== null;
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
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
