<template>
  <app-header></app-header>
  <div
    class="d-flex justify-content-end align-items-center"
    style="position: absolute; bottom: 0; right: 0"
  >
    <i class="flag flag-serbia"></i>
    <MDBSwitch v-model="language" @click="changeLocale"></MDBSwitch>
    <i class="flag flag-united-states"></i>
  </div>
  <router-view />
</template>

<script>
import { onMounted, ref } from "vue";
import AppHeader from "./components/Header.vue";
import Dropdown from "primevue/dropdown";
import { MDBSwitch } from "mdb-vue-ui-kit";
import { setLocale } from "@vee-validate/i18n";
import i18n from "@/plugins/i18n";

export default {
  name: "App",
  components: {
    AppHeader,
    Dropdown,
    MDBSwitch,
  },
  setup() {
    const language = ref(
      sessionStorage.getItem("language") === "en" ? true : false
    );

    onMounted(() => {
      const lang = sessionStorage.getItem("language");
      setLocale(lang);
      i18n.global.locale = lang;
    });

    const changeLocale = () => {
      //reverted boolean values
      const lang = language.value ? "rs" : "en";
      setLocale(lang);
      i18n.global.locale = lang;
      sessionStorage.setItem("language", lang);
    };

    return {
      language,
      changeLocale,
    };
  },
};
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}
.form-check-input[type="checkbox"]:checked {
  background-color: rgba(0, 0, 0, 0.25) !important;
}
</style>
