<template>
  <MDBDropdown class="nav-item" v-model="dropdown">
    <MDBDropdownToggle tag="a" class="nav-link" @click="dropdown = !dropdown">{{
      capitalizeFirstLetter($t(`component.${name}`))
    }}</MDBDropdownToggle>
    <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
      <MDBDropdownItem :href="props.name">{{
        $t("header.goToMenuComponent", {
          componentName: $t(`component.${name}Plural`),
        })
      }}</MDBDropdownItem>
      <MDBDropdownItem href="form">{{
        $t("header.addMenuComponent", {
          componentName: $t(`component.${name}`),
        })
      }}</MDBDropdownItem>
    </MDBDropdownMenu>
  </MDBDropdown>
</template>

<script>
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-vue-ui-kit";
import { ref } from "vue";

export default {
  name: "AppDropdown",
  components: {
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
  },
  props: ["name", "plural"],
  setup(props) {
    const dropdown = ref(false);

    const capitalizeFirstLetter = (s) => {
      return s && s[0].toUpperCase() + s.slice(1);
    };

    return { props, dropdown, capitalizeFirstLetter };
  },
};
</script>

<style></style>
