<template>
  <div class="container">
    <div class="row lg-6 md-6 align-items-center justify-content-center">
      <div class="col-lg-6 col-md-6 col-12">
        <h1 class="display-6 text-center m-4">
          {{ $t("city.listTitle") }}
        </h1>
      </div>
    </div>
    <div class="row lg-6 md-6 align-items-center justify-content-center">
      <div class="col-lg-6 col-md-6 col-12">
        <vee-form
          md="6"
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
              placeholder="Postal code"
              v-model="city.postalCode"
              :disabled="city.postalCode != 0"
            />
            <ErrorMessage name="postalCode" class="mb-3 text-danger" />
          </div>
          <!-- Name input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="name"
              type="text"
              placeholder="Name"
              v-model="city.name"
            />
          </div>
          <ErrorMessage name="name" class="mb-3 text-danger" />
          <!-- Submit button -->
          <MDBBtnGroup class="d-flex justify-content-center">
            <MDBBtn color="sucess" type="submit">{{
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
import { onBeforeMount, ref } from "vue";
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

    let city = ref({ postalCode: 0, name: "" });
    let mode = "";
    onBeforeMount(() => {
      if (route.params.id) {
        city.value = route.meta.city["data"];
        mode = "update";
      } else mode = "add";
    });

    const schema = {
      postalCode: "required|min_value:10000|max_value:99999",
      name: "required|alpha|min:2|max:30",
    };

    const addOrUpdateCity = (values) => {
      if (mode === "add") {
        addCity(values)
          .then((res) => {
            router.push({ name: "city-list" });
          })
          .catch((err) => console.log("error happened", err));
      } else if (mode === "update") {
        updateCity(values)
          .then((res) => {
            router.push({ name: "city-list" });
          })
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

    return { city, schema, addOrUpdateCity, redirect };
  },
};
</script>

<style></style>
