import "mdb-vue-ui-kit/css/mdb.min.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import i18n from "@/plugins/i18n";
import VeeValidatePlugin from "@/plugins/validation";
import PrimeVue from "primevue/config";
import progressBar from "@/plugins/progress-bar";
import { basicInterceptor } from "@/plugins/basic.interceptor";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import moment from "moment";

import "nprogress/nprogress.css";
//theme
import "primevue/resources/themes/tailwind-light/theme.css";
//core
import "primevue/resources/primevue.min.css";

progressBar(router);

let app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(router);
app.use(pinia);
app.use(i18n);
app.use(VeeValidatePlugin);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.config.globalProperties.$filters = {
  datePipe(value) {
    if (!value) return "";
    return moment(value, "DD.MM.YYYY").add(1, "days").format("DD.MM.YYYY");
  },
};
basicInterceptor();

sessionStorage.setItem("language", "en");

app.mount("#app");
