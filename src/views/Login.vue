<template>
  <div class="container">
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
          @submit="login"
        >
          <!-- Username input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="username"
              type="text"
              :placeholder="$t('login.username')"
            />
            <ErrorMessage name="username" class="mb-3 text-danger" />
          </div>
          <!-- Password input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="password"
              type="password"
              :placeholder="$t('login.password')"
            />
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
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import Toast from "primevue/toast";

export default {
  name: "AppLogin",
  components: {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBContainer,
    Toast,
  },
  setup() {
    const userStore = useUserStore();

    const toast = useToast();
    const { t } = useI18n();

    const schema = {
      username: "required|min:4",
      password: "required",
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
          const token =
            "Basic " + btoa(`${values.username}:${values.password}`);
          sessionStorage.setItem("token", token);
          toast.add({
            severity: "success",
            summary: t("messages.success_login"),
            detail: "",
            life: 2000,
          });
        })
        .catch((err) =>
          toast.add({
            severity: "error",
            summary: t("messages.fail_login"),
            detail: err,
            life: 2000,
          })
        );
    };

    return { schema, login };
  },
};
</script>

<style scoped>
.container {
  min-height: 100vh;
}
.row {
  min-height: 80vh;
}
</style>
