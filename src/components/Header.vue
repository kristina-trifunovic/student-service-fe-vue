<template>
  <MDBNavbar expand="lg" light bg="light" container>
    <MDBNavbarBrand></MDBNavbarBrand>
    <MDBNavbarToggler
      @click="navbarCollapse = !navbarCollapse"
      target="#navbarSupportedContent"
    ></MDBNavbarToggler>
    <MDBCollapse v-model="navbarCollapse" id="menu">
      <MDBNavbarNav class="mb-lg-0">
        <MDBNavbarItem to="#" active> Home </MDBNavbarItem>
        <!-- City navbar dropdown -->
        <MDBNavbarItem>
          <app-dropdown name="city" plural="cities"></app-dropdown>
        </MDBNavbarItem>
        <!-- Student navbar dropdown -->
        <MDBNavbarItem>
          <app-dropdown name="student" plural="students"></app-dropdown>
        </MDBNavbarItem>
        <!-- Subject navbar dropdown -->
        <MDBNavbarItem>
          <app-dropdown name="subject" plural="subjects"></app-dropdown>
        </MDBNavbarItem>
        <!-- Professor navbar dropdown -->
        <MDBNavbarItem>
          <app-dropdown name="professor" plural="professors"></app-dropdown>
        </MDBNavbarItem>
        <!-- Exam navbar dropdown -->
        <MDBNavbarItem>
          <app-dropdown name="exam" plural="exams"></app-dropdown>
        </MDBNavbarItem>
        <!-- Exam period navbar dropdown -->
        <MDBNavbarItem>
          <app-dropdown name="exam period" plural="exam periods"></app-dropdown>
        </MDBNavbarItem>
      </MDBNavbarNav>
    </MDBCollapse>
    <!-- User and language -->
    <MDBNavbarNav>
      <MDBDropdown class="nav-item" v-model="dropdownUser">
        <MDBDropdownToggle
          tag="a"
          class="nav-link"
          @click="dropdownUser = !dropdownUser"
          ><img
            src="https://mdbootstrap.com/img/Photos/Avatars/img (31).webp"
            class="rounded-circle"
            height="33"
            alt=""
            loading="lazy"
          />
        </MDBDropdownToggle>
        <MDBDropdownMenu>
          <MDBDropdownItem disabled href="#">{{ fullName }}</MDBDropdownItem>
          <MDBDropdownItem href="#">{{
            $t("header.settings")
          }}</MDBDropdownItem>
          <MDBDropdownItem href="#">{{ $t("header.logout") }}</MDBDropdownItem>
        </MDBDropdownMenu>
      </MDBDropdown>
    </MDBNavbarNav>
  </MDBNavbar>
</template>

<script>
import {
  MDBBtn,
  MDBNavbar,
  MDBNavbarToggler,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-vue-ui-kit";
import useUserStore from "@/stores/user";
import { ref } from "vue";
import AppDropdown from "@/components/DropdownItem.vue";

export default {
  name: "AppHeader",
  components: {
    MDBBtn,
    MDBNavbar,
    MDBNavbarToggler,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBCollapse,
    AppDropdown,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
  },
  setup() {
    const navbarCollapse = ref(false);
    const dropdownUser = ref(false);

    const userStore = useUserStore();
    const fullName = `${userStore.user.firstName} ${userStore.user.lastName}`;
    return {
      fullName,
      navbarCollapse,
      dropdownUser,
    };
  },
};
</script>

<style></style>
