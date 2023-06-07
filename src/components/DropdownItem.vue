<template>
  <MDBDropdown class="nav-item" v-model="dropdown">
    <MDBDropdownToggle tag="a" class="nav-link" @click="dropdown = !dropdown">{{
      capitalizeFirstLetter($t(`component.${name}`))
    }}</MDBDropdownToggle>
    <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
      <MDBDropdownItem
        tag="button"
        @click="redirectList"
        v-show="props.name != 'exam period' && props.name != 'exam'"
        >{{
          $t("header.goToMenuComponent", {
            componentName: $t(`component.${name}Plural`),
          })
        }}</MDBDropdownItem
      >
      <MDBDropdownItem tag="button" @click="redirectForm">{{
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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

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
    const router = useRouter();
    const dropdown = ref(false);

    const capitalizeFirstLetter = (s) => {
      return s && s[0].toUpperCase() + s.slice(1);
    };

    let componentName = "";
    onMounted(() => {
      if (props.name === "exam period") componentName = "exam-period";
      else componentName = props.name;
    });

    const redirectForm = () => {
      router.push({ name: `${componentName}-add` });
    };

    const redirectList = () => {
      router.push({ name: `${componentName}-list` });
    };

    return {
      props,
      dropdown,
      capitalizeFirstLetter,
      componentName,
      redirectForm,
      redirectList,
    };
  },
};
</script>

<style></style>
