<template>
  <div class="container">
    <div class="row align-items-center justify-content-center">
      <div class="col-lg-6 col-md-6 col-12">
        <h1 class="my-5 display-3 fw-bold">
          Welcome to <br />
          <span class="text-primary">Faculty portal</span>
        </h1>
        <p class="text-muted">
          This is where you can find our new system for storing exams, students,
          professors...
        </p>
      </div>
      <form class="col-lg-3 col-md-6 col-12">
        <!-- Email input -->
        <MDBInput
          type="text"
          label="Username"
          id="username"
          v-model="user.username"
          wrapperClass="mb-4"
        />
        <!-- Password input -->
        <MDBInput
          type="password"
          label="Password"
          id="password"
          v-model="user.password"
          wrapperClass="mb-4"
        />
        <MDBRow class="mb-4">
          <MDBCol class="d-flex justify-content-center">
            <!-- Checkbox -->
            <MDBCheckbox
              label="Remember me"
              id="rememberMe"
              v-model="rememberMe"
              wrapperClass="mb-3 mb-md-0"
            />
          </MDBCol>
        </MDBRow>
        <!-- Submit button -->
        <MDBBtn color="primary" block @click.prevent="login"> Sign in </MDBBtn>
      </form>
    </div>
  </div>
</template>

<script>
import { MDBRow, MDBCol, MDBInput, MDBCheckbox, MDBBtn } from "mdb-vue-ui-kit";
import { reactive, ref } from "vue";
import router from "@/router/index";
import useUserStore from "@/stores/user";

export default {
  name: "AppLogin",
  components: { MDBRow, MDBCol, MDBInput, MDBCheckbox, MDBBtn },
  setup() {
    const userStore = useUserStore();
    const user = reactive({ username: "", password: "" });
    const rememberMe = ref(true);

    const login = () => {
      userStore
        .login(user)
        .then((res) => {
          actionOnLogin(res.data);
        })
        // TODO add a popup
        .catch((err) => console.log("error happened", err));
    };

    const actionOnLogin = (user) => {
      userStore.isUserLoggedIn = true;
      // userStore.userLoggedIn = user;
      if (rememberMe) {
        sessionStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.setItem("user", JSON.stringify(user));
      }
      localStorage.setItem("rememberMe", rememberMe);
      router.push({ name: "home" });
    };

    return { user, login, rememberMe };
  },
};
</script>

<style></style>
