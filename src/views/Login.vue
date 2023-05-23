<template>
  <div class="container h-100">
    <div class="row lg-6 md-6 align-items-center justify-content-center">
      <div class="col-lg-6 col-md-6 col-12">
        <h1 class="my-5 display-3 fw-bold">
          {{ $t("login.welcome") }} <br />
          <span class="text-primary">{{ $t("login.name") }}</span>
        </h1>
        <p class="text-muted">
          {{ $t("login.description") }}
        </p>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <vee-form
          md="6"
          class="align-items-center"
          :validation-schema="schema"
          @submit.prevent="login"
        >
          <!-- Username input -->
          <div class="d-flex flex-column col-12">
            <vee-field class="form-control mb-2" name="username" type="text" />
            <ErrorMessage name="username" class="mb-3 text-danger" />
          </div>
          <!-- Password input -->
          <div class="d-flex flex-column col-12">
            <vee-field class="form-control mb-2" name="password" type="text" />
          </div>
          <ErrorMessage name="password" class="mb-3 text-danger" />
          <!-- Submit button -->
          <MDBBtn color="primary" block type="submit">{{
            $t("login.signIn")
          }}</MDBBtn>
        </vee-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBContainer,
} from "mdb-vue-ui-kit";
import router from "@/router/index";
import useUserStore from "@/stores/user";

export default {
  name: "AppLogin",
  components: {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBContainer,
  },
  setup() {
    const userStore = useUserStore();
    const schema = {
      username: "required|between:3,30",
      password: "required|min:4",
    };
    const actionOnLogin = (user) => {
      userStore.userLoggedIn = user;
      sessionStorage.setItem("user", JSON.stringify(user));
      router.push({ name: "home" });
    };

    const login = (values) => {
      userStore
        .login(values)
        .then((res) => {
          actionOnLogin(res.data);
        })
        // TODO add a popup
        .catch((err) => console.log("error happened", err));
    };

    // const { handleSubmit, resetForm } = useForm();

    // const checkForm = handleSubmit(
    //   (values) => {
    //     alert("Success! Your data: " + JSON.stringify(values, null, 2));
    //     login();
    //   },
    //   () => {
    //     console.log("form is not correctly validated");
    //   }
    // );

    return { schema, login };
  },
};
</script>
