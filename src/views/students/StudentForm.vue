<template>
  <div class="container">
    <div class="row lg-6 md-6 align-items-center justify-content-center">
      <div class="col-lg-8 col-md-8 col-12">
        <h1 class="display-6 text-center m-4">
          {{
            mode == "update"
              ? $t("student.updateTitle")
              : $t("student.addTitle")
          }}
        </h1>
      </div>
    </div>
    <div class="row lg-4 md-4 align-items-center justify-content-center">
      <div class="col-lg-6 col-md-6 col-12">
        <vee-form
          class="align-items-center"
          :validation-schema="schema"
          @submit="addOrUpdateStudent"
        >
          <div class="row">
            <!-- Username input -->
            <div class="d-flex flex-column col-6">
              <vee-field
                class="form-control mb-2"
                name="username"
                type="text"
                :placeholder="$t('login.username')"
                v-model="student.username"
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
                v-model="student.password"
                :disabled="mode == 'update'"
              />
              <ErrorMessage name="password" class="mb-3 text-danger" />
            </div>
          </div>
          <div class="row">
            <!-- Index number input -->
            <div class="d-flex flex-column col-6">
              <vee-field
                class="form-control mb-2"
                name="indexNumber"
                type="text"
                :placeholder="$t('student.indexNumber')"
                v-model="student.index.indexNumber"
                :disabled="mode == 'update'"
              />
              <ErrorMessage name="indexNumber" class="mb-3 text-danger" />
            </div>
            <!-- Index year input -->
            <div class="d-flex flex-column col-6">
              <vee-field
                class="form-control mb-2"
                name="indexYear"
                type="number"
                :placeholder="$t('student.indexYear')"
                v-model="student.index.indexYear"
                :disabled="mode == 'update'"
              />
              <ErrorMessage name="indexYear" class="mb-3 text-danger" />
            </div>
          </div>
          <!-- First name input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="firstName"
              type="text"
              :placeholder="$t('student.firstName')"
              v-model="student.firstName"
            />
            <ErrorMessage name="firstName" class="mb-3 text-danger" />
          </div>
          <!-- Last name input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="lastName"
              type="text"
              :placeholder="$t('student.lastName')"
              v-model="student.lastName"
            />
            <ErrorMessage name="lastName" class="mb-3 text-danger" />
          </div>
          <!-- Email input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="email"
              type="text"
              :placeholder="$t('student.email')"
              v-model="student.email"
            />
            <ErrorMessage name="email" class="mb-3 text-danger" />
          </div>
          <!-- Address input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="address"
              type="text"
              :placeholder="$t('student.address')"
              v-model="student.address"
            />
            <ErrorMessage name="address" class="mb-3 text-danger" />
          </div>
          <!-- Current year of study input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="currentYearOfStudy"
              type="text"
              :placeholder="$t('student.currentYearOfStudy')"
              v-model="student.currentYearOfStudy"
            />
            <ErrorMessage name="currentYearOfStudy" class="mb-3 text-danger" />
          </div>
          <!-- City select -->
          <vee-field name="city" v-model="student.city">
            <select v-model="student.city" class="form-control mb-2">
              <option value="" disabled>
                {{ $t("student.selectCity") }}
              </option>
              <option
                v-for="city in cities"
                :key="city.postalCode"
                :value="city"
              >
                {{ city.name }}
              </option>
            </select>
          </vee-field>
          <ErrorMessage name="city" class="mb-3 text-danger" />

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
        student.value = route.meta.student["data"];
        mode.value = "update";
      } else mode.value = "add";
      loadCities()
        .then((res) => (cities.value = res.data))
        .catch((err) => console.log(err));
    });

    let cities = ref([]);
    const loadCities = () => {
      return axios.get(`${environment.serverUrl}/cities`);
    };

    const schema = {
      username: "required|min:4",
      password: "required",
      indexNumber: "required|max:4|numeric",
      indexYear: "required|min_value:2000|max_value:2100",
      firstName: "required|min:3|max:30",
      lastName: "required|min:3|max:30",
      email: "required|email|max:30",
      address: "min:3|max:50",
      city: "required",
      currentYearOfStudy: "required|min_value:1|max_value:9",
    };

    let student = ref({ index: {} });

    const addOrUpdateStudent = () => {
      if (mode.value == "add") {
        addStudent(student.value)
          .then(() => redirect())
          .catch((err) => console.log("error happened", err));
      } else if (mode.value == "update") {
        updateStudent(student.value)
          .then(() => redirect())
          // TODO add a popup
          .catch((err) => console.log("error happened", err));
      }
    };

    const addStudent = (student) => {
      return axios.post(`${environment.serverUrl}/students`, student);
    };
    const updateStudent = (student) => {
      return axios.put(`${environment.serverUrl}/students`, student);
    };

    const redirect = () => {
      router.push({ name: "student-list" });
    };

    return {
      student,
      schema,
      addOrUpdateStudent,
      redirect,
      mode,
      cities,
    };
  },
};
</script>

<style></style>
