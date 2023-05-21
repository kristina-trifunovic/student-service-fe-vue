<template>
  <app-header></app-header>
  <router-view />
</template>

<script>
import AppHeader from "./components/Header.vue";

export default {
  name: "App",
  components: {
    AppHeader,
  },
  setup() {
    // VeeValidate.Validator.locale = `${language}`; // to change the locale for vee validate
  },
};
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}
</style>
