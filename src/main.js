// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia"; // 👈 Import Pinia
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
const app = createApp(App);

// [PENTING] Akses Router di Pinia Store (opsional, tapi berguna untuk redirect)
pinia.use(({ store }) => {
  store.router = router;
});

app.use(pinia); // 👈 Gunakan Pinia
app.use(router);
app.mount("#app");
