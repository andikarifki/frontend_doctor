import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Dashboard from "../components/Dashboard.vue";
import PasienCreatePage from "../views/PasienCreatePage.vue";
import DaftarPraktik from "../views/DaftarPraktik.vue";

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
    meta: { requiresAuth: true, title: "Dashboard", fullLayout: false },
  },
  {
    path: "/pasien/create",
    name: "PasienCreate",
    component: PasienCreatePage,
    meta: { requiresAuth: true, title: "Daftar Pasien", fullLayout: false },
  },
  {
    path: "/daftar",
    name: "DaftarPraktik",
    component: DaftarPraktik,
    meta: { requiresAuth: true, title: "Daftar Praktik", fullLayout: false },
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
