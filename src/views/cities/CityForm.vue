<template>
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
import axios from "axios";

export default {
  name: "AppCityForm",
  components: { MDBBtnGroup, MDBBtn },
  setup() {
    const route = useRoute();
    const router = useRouter();

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
          .then(() => redirect())
          .catch((err) => console.log("error happened", err));
      } else if (mode.value == "update") {
        updateCity(values)
          .then(() => redirect())
          // TODO add a popup
          .catch((err) => console.log("error happened", err));
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
