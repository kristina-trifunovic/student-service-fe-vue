import "mdb-vue-ui-kit/css/mdb.min.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import i18n from "@/plugins/i18n";
import VeeValidatePlugin from "@/plugins/validation";
import PrimeVue from "primevue/config";
import progressBar from "./plugins/progress-bar";

import "nprogress/nprogress.css";

progressBar(router);

let app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(router);
app.use(pinia);
app.use(i18n);
app.use(VeeValidatePlugin);
app.use(PrimeVue);

app.mount("#app");
