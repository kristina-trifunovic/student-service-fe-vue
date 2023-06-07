<template>
  <Toast />
  <div class="container">
    <div class="row lg-6 md-6 align-items-center justify-content-center">
      <div class="col-lg-6 col-md-6 col-12">
        <h1 class="display-6 text-center m-4">
          {{ mode == "update" ? $t("city.updateTitle") : $t("city.addTitle") }}
        </h1>
      </div>
    </div>
    <div class="row lg-4 md-4 align-items-center justify-content-center">
      <div class="col-lg-4 col-md-4 col-12">
        <vee-form
          class="align-items-center"
          :validation-schema="schema"
          @submit="addOrUpdateCity"
        >
          <!-- Postal code input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="postalCode"
              type="number"
              :placeholder="$t('city.postalCode')"
              v-model="city.postalCode"
              :disabled="mode == 'update'"
            />
            <ErrorMessage name="postalCode" class="mb-3 text-danger" />
          </div>
          <!-- Name input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="name"
              type="text"
              :placeholder="$t('city.name')"
              v-model="city.name"
            />
            <ErrorMessage name="name" class="mb-3 text-danger" />
          </div>
          <!-- Submit button -->
          <MDBBtnGroup class="d-flex justify-content-center">
            <MDBBtn color="outline" type="submit">{{
              $t("actions.save")
            }}</MDBBtn>
            <MDBBtn color="warning" @click="redirect">{{
              $t("actions.cancel")
            }}</MDBBtn>
          </MDBBtnGroup>
        </vee-form>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { MDBBtnGroup, MDBBtn } from "mdb-vue-ui-kit";
import { environment } from "@/environments/environment";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import axios from "axios";
import Toast from "primevue/toast";

export default {
  name: "AppCityForm",
  components: { MDBBtnGroup, MDBBtn, Toast },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const { t } = useI18n();

    let mode = ref("");
    onMounted(() => {
      if (route.params.id) {
        city.value = route.meta.city["data"];
        mode.value = "update";
      } else mode.value = "add";
    });

    const schema = {
      postalCode: "required|min_value:10000|max_value:99999",
      name: "required|alpha|min:2|max:30",
    };

    let city = ref({});
    const addOrUpdateCity = (values) => {
      if (mode.value == "add") {
        addCity(values)
          .then(() => {
            setTimeout(() => redirect(), 1000);
            toast.add({
              severity: "success",
              summary: t("messages.success_add", {
                componentName: t("component.city"),
              }),
              detail: "",
              life: 2000,
            });
          })
          .catch((err) =>
            toast.add({
              severity: "error",
              summary: t("messages.fail_add", {
                componentName: t("component.city"),
              }),
              detail: err,
              life: 2000,
            })
          );
      } else if (mode.value == "update") {
        updateCity(values)
          .then(() => {
            setTimeout(() => redirect(), 1000);
            toast.add({
              severity: "success",
              summary: t("messages.success_update", {
                componentName: t("component.city"),
              }),
              detail: "",
              life: 2000,
            });
          })
          .catch((err) =>
            toast.add({
              severity: "error",
              summary: t("messages.fail_update", {
                componentName: t("component.city"),
              }),
              detail: err,
              life: 2000,
            })
          );
      }
    };

    const addCity = (city) => {
      return axios.post(`${environment.serverUrl}/cities`, city);
    };
    const updateCity = (city) => {
      return axios.put(`${environment.serverUrl}/cities`, city);
    };

    const redirect = () => {
      router.push({ name: "city-list" });
    };

    return {
      city,
      schema,
      addOrUpdateCity,
      redirect,
      mode,
    };
  },
};
</script>

<style></style>
