<template>
  <div class="container h-100">
    <div class="row lg-6 md-6 align-items-center justify-content-center">
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
      <div class="col-lg-4 col-md-6 col-12">
        <MDBRow
          md="6"
          class="align-items-center"
          tag="form"
          novalidate
          ref="formRef"
        >
          <!-- Username input -->
          <MDBInput
            type="text"
            label="Username"
            id="username"
            v-model="user.username"
            validationEvent="input"
            :invalidFeedback="$t('...')"
            wrapperClass="mb-4"
            required
            minLength="3"
            maxLength="30"
          />
          <Field name="username" v-slot="{}">
            <!-- Password input -->
            <MDBInput
              type="password"
              label="Password"
              id="password"
              v-model="user.password"
              validationEvent="input"
              :invalidFeedback="$t('error.password')"
              wrapperClass="mb-4"
              required
              minLength="4"
            />
          </Field>
          <MDBBtn color="primary" block type="submit" @click="checkForm"
            >Sign in</MDBBtn
          >
        </MDBRow>
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
import { useForm, Field } from "vee-validate";
import { reactive } from "vue";
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
    Field,
  },
  setup() {
    const userStore = useUserStore();
    const user = reactive({ username: "", password: "" });

    const actionOnLogin = (user) => {
      userStore.userLoggedIn = user;
      sessionStorage.setItem("user", JSON.stringify(user));
      router.push({ name: "home" });
    };

    const login = () => {
      userStore
        .login(user)
        .then((res) => {
          actionOnLogin(res.data);
        })
        // TODO add a popup
        .catch((err) => console.log("error happened", err));
    };

    const { handleSubmit, resetForm } = useForm();

    const checkForm = handleSubmit((values) => {
      alert("Success! Your data: " + JSON.stringify(values, null, 2));
      login();
    });

    return { user, login, checkForm };
  },
};
</script>
