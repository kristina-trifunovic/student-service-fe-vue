<template>
  <Toast />
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
              <ErrorMessage name="firstName" class="mb-3 text-danger" />
            </div>
            <!-- Last name input -->
            <div class="d-flex flex-column col-6">
              <vee-field
                class="form-control mb-2"
                name="lastName"
                type="text"
                :placeholder="$t('professor.lastName')"
                v-model="professor.lastName"
              />
              <ErrorMessage name="lastName" class="mb-3 text-danger" />
            </div>
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
            <ErrorMessage name="email" class="mb-3 text-danger" />
          </div>
          <!-- Address input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="address"
              type="text"
              :placeholder="$t('professor.address')"
              v-model="professor.address"
            />
            <ErrorMessage name="address" class="mb-3 text-danger" />
          </div>
          <div class="row">
            <!-- Reelection Date input -->
            <div class="d-flex flex-column col-6">
              <vee-field
                class="form-control mb-2"
                name="reelectionDate"
                v-model="professor.reelectionDate"
                :placeholder="$t('professor.reelectionDate')"
              >
                <calendar
                  style="margin-bottom: 0.5rem"
                  v-model="professor.reelectionDate"
                  :manualInput="false"
                  dateFormat="dd.mm.yy"
                  showIcon
                ></calendar>
              </vee-field>
              <ErrorMessage name="reelectionDate" class="mb-3 text-danger" />
            </div>
            <!-- Phone input -->
            <div class="d-flex flex-column col-6">
              <vee-field
                class="form-control mb-2"
                style="padding-top: 1rem"
                name="phone"
                type="text"
                :placeholder="$t('professor.phone')"
                v-model="professor.phone"
              />
              <ErrorMessage name="phone" class="mb-3 text-danger" />
            </div>
          </div>
          <!-- City select -->
          <vee-field
            name="city"
            :placeholder="$t('professor.city')"
            v-model="professor.city"
          >
            <select v-model="professor.city" class="form-control mb-2">
              <option value="" disabled>
                {{ $t("professor.selectCity") }}
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
          <!-- Title select -->
          <vee-field name="title" v-model="professor.title">
            <select
              v-model="professor.title"
              class="form-control mb-2"
              :placeholder="$t('professor.title')"
              @change="onChange"
              :selected="professor.title"
            >
              <option value="" disabled>
                {{ $t("professor.selectTitle") }}
              </option>
              <option
                v-for="title in titles"
                :key="title.id"
                :value="title"
                :selected="value"
              >
                {{ title.professorTitle }}
              </option>
            </select>
          </vee-field>
          <ErrorMessage name="title" class="mb-3 text-danger" />

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
import Calendar from "primevue/calendar";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import axios from "axios";
import Toast from "primevue/toast";
import moment from "moment";

export default {
  name: "AppProfessorForm",
  components: { MDBBtnGroup, MDBBtn, Calendar, Toast },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const { t } = useI18n();

    let mode = ref("");
    onMounted(() => {
      if (route.params.username) {
        professor.value = route.meta.professor["data"];
        mode.value = "update";
      } else mode.value = "add";
      loadCities()
        .then((res) => (cities.value = res.data))
        .catch((err) =>
          toast.add({
            severity: "error",
            summary: t("messages.fail_load", {
              componentName: t("component.cityPlural"),
            }),
            detail: err,
            life: 3000,
          })
        );
      loadTitles()
        .then((res) => (titles.value = res.data))
        .catch((err) =>
          toast.add({
            severity: "error",
            summary: t("messages.fail_load", {
              componentName: t("component.titlePlural"),
            }),
            detail: err,
            life: 3000,
          })
        );
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
      title: "required",
      phone: "min:9|max:15|numeric",
      reelectionDate: "required",
    };

    let professor = ref({});

    const addOrUpdateProfessor = () => {
      professor.value.reelectionDate = moment(
        professor.value.reelectionDate
      ).format("DD.MM.YYYY");
      if (mode.value == "add") {
        addProfessor(professor.value)
          .then(() => {
            setTimeout(() => redirect(), 1000);
            toast.add({
              severity: "success",
              summary: t("messages.success_add", {
                componentName: t("component.professor"),
              }),
              detail: "",
              life: 3000,
            });
          })
          .catch((err) =>
            toast.add({
              severity: "error",
              summary: t("messages.fail_add", {
                componentName: t("component.professor"),
              }),
              detail: err,
              life: 3000,
            })
          );
      } else if (mode.value == "update") {
        updateProfessor(professor.value)
          .then(() => {
            setTimeout(() => redirect(), 1000);
            toast.add({
              severity: "success",
              summary: t("messages.success_update", {
                componentName: t("component.professor"),
              }),
              detail: "",
              life: 3000,
            });
          })
          .catch((err) =>
            toast.add({
              severity: "error",
              summary: t("messages.fail_update", {
                componentName: t("component.professor"),
              }),
              detail: err,
              life: 3000,
            })
          );
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

    return {
      professor,
      schema,
      addOrUpdateProfessor,
      redirect,
      mode,
      cities,
      titles,
    };
  },
};
</script>
