<template>
  <app-header></app-header>
  <router-view />
</template>

<script>
import AppHeader from "./components/Header.vue";
// import AppLogin from "@/views/Login.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    // AppLogin,
  },
};
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}
</style>
