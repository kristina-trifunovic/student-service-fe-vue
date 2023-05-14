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
import { reactive } from "vue";
import axios from "axios";
import router from "@/router/index.js";

export default {
  name: "AppLogin",
  components: { MDBRow, MDBCol, MDBInput, MDBCheckbox, MDBBtn },
  setup() {
    const user = reactive({ username: "", password: "" });
    const login = () => {
      const params = new URLSearchParams();
      params.append("username", user.username);
      params.append("password", user.password);
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      axios
        .post("http://localhost:9090/auth/login", params, config)
        .then(() => router.push({ name: "home" }))
        .catch((err) => console.log(err));
    };

    return { user, login };
  },
};
</script>

<style></style>
