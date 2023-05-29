<template>
  <div class="container">
    <div class="row lg-6 md-6 align-items-center justify-content-center">
      <div class="col-lg-8 col-md-8 col-12">
        <h1 class="display-6 text-center m-4">
          {{
            mode == "update"
              ? $t("professor.updateTitle")
              : $t("professor.addTitle")
          }}
        </h1>
      </div>
    </div>
    <div class="row lg-4 md-4 align-items-center justify-content-center">
      <div class="col-lg-6 col-md-12 col-12">
        <vee-form
          class="align-items-center"
          :validation-schema="schema"
          @submit="addOrUpdateProfessor"
        >
          <div class="row">
            <!-- Username input -->
            <div class="d-flex flex-column col-6">
              <vee-field
                class="form-control mb-2"
                name="username"
                type="text"
                :placeholder="$t('login.username')"
                v-model="professor.username"
                :disabled="mode == 'update'"
              />
              <ErrorMessage name="username" class="mb-3 text-danger" />
            </div>
            <!-- Password input -->
            <div class="d-flex flex-column col-6">
              <vee-field
                class="form-control mb-2"
                name="password"
                type="password"
                :placeholder="$t('login.password')"
                v-model="professor.password"
                :disabled="mode == 'update'"
              />
              <ErrorMessage name="password" class="mb-3 text-danger" />
            </div>
          </div>
          <div class="row">
            <!-- First name input -->
            <div class="d-flex flex-column col-6">
              <vee-field
                class="form-control mb-2"
                name="firstName"
                type="text"
                :placeholder="$t('professor.firstName')"
                v-model="professor.firstName"
              />
            </div>
            <ErrorMessage name="firstName" class="mb-3 text-danger" />
            <!-- Last name input -->
            <div class="d-flex flex-column col-6">
              <vee-field
                class="form-control mb-2"
                name="lastName"
                type="text"
                :placeholder="$t('professor.lastName')"
                v-model="professor.lastName"
              />
            </div>
            <ErrorMessage name="lastName" class="mb-3 text-danger" />
          </div>
          <!-- Email input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="email"
              type="text"
              :placeholder="$t('professor.email')"
              v-model="professor.email"
            />
          </div>
          <ErrorMessage name="email" class="mb-3 text-danger" />
          <!-- Address input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="address"
              type="text"
              :placeholder="$t('professor.address')"
              v-model="professor.address"
            />
          </div>
          <ErrorMessage name="address" class="mb-3 text-danger" />
          <!-- Reelection Date input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="reelectionDate"
              type="date"
              :placeholder="$t('professor.reelectionDate')"
              value="professor.reelectionDate"
              v-model="professor.reelectionDate"
            />
          </div>
          <ErrorMessage name="reelectionDate" class="mb-3 text-danger" />
          <!-- Phone input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="phone"
              type="text"
              :placeholder="$t('professor.phone')"
              v-model="professor.phone"
            />
          </div>
          <ErrorMessage name="phone" class="mb-3 text-danger" />
          <!-- City select -->
          <vee-field
            class="form-control mb-2"
            name="city"
            as="select"
            v-model="professor.city"
            :placeholder="$t('professor.city')"
          >
            <option value="" disabled>{{ $t("professor.selectCity") }}</option>
            <option v-for="city in cities" :key="city.postalCode" :value="city">
              {{ city.name }}
            </option>
          </vee-field>
          <!-- Title select -->
          <vee-field
            class="form-control mb-2"
            name="title"
            as="select"
            v-model="professor.title"
            :placeholder="$t('professor.title')"
          >
            <option value="" disabled>{{ $t("professor.selectTitle") }}</option>
            <option v-for="title in titles" :key="title.id" :value="title">
              {{ title.professorTitle }}
            </option>
          </vee-field>

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
  name: "AppStudentForm",
  components: { MDBBtnGroup, MDBBtn },
  setup() {
    const route = useRoute();
    const router = useRouter();

    let mode = ref("");
    onMounted(() => {
      if (route.params.username) {
        professor.value = route.meta.professor["data"];
        mode.value = "update";
      } else mode.value = "add";
      loadCities()
        .then((res) => (cities.value = res.data))
        .catch((err) => console.log(err));
      loadTitles()
        .then((res) => (titles.value = res.data))
        .catch((err) => console.log(err));
    });

    let cities = ref([]);
    const loadCities = () => {
      return axios.get(`${environment.serverUrl}/cities`);
    };

    let titles = ref([]);
    const loadTitles = () => {
      return axios.get(`${environment.serverUrl}/titles`);
    };

    const schema = {
      username: "required|min:4",
      password: "required",
      firstName: "required|min:3|max:30",
      lastName: "required|min:3|max:30",
      email: "required|email|max:30",
      address: "min:3|max:50",
      city: "required",
      phone: "min:9|max:15|numeric",
      reelectionDate: "",
    };

    let professor = ref({});

    const addOrUpdateProfessor = () => {
      professor.value.reelectionDate = formatDate(
        professor.value.reelectionDate
      );
      if (mode.value == "add") {
        addProfessor(professor.value)
          .then(() => redirect())
          .catch((err) => console.log("error happened", err));
      } else if (mode.value == "update") {
        updateProfessor(professor.value)
          .then(() => redirect())
          // TODO add a popup
          .catch((err) => console.log("error happened", err));
      }
    };

    const addProfessor = (professor) => {
      return axios.post(`${environment.serverUrl}/professors`, professor);
    };
    const updateProfessor = (professor) => {
      return axios.put(`${environment.serverUrl}/professors`, professor);
    };

    const redirect = () => {
      router.push({ name: "professor-list" });
    };

    const formatDate = (reelectionDate) => {
      //2023-05-26
      const [year, month, day] = reelectionDate.split("-");
      return `${day}.${month}.${year}`;
    };

    return {
      professor,
      schema,
      addOrUpdateProfessor,
      redirect,
      mode,
      cities,
      titles,
      formatDate,
    };
  },
};
</script>

<style></style>
