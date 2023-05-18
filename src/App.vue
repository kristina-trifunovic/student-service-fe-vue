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
  setup() {},
};
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}
</style>
