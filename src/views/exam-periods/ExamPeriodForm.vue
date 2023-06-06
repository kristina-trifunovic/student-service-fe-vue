<template>
  <div class="container">
    <div class="row lg-6 md-6 align-items-center justify-content-center">
      <div class="col-lg-8 col-md-8 col-12">
        <h1 class="display-6 text-center m-4">
          {{ $t("examPeriod.addTitle") }}
        </h1>
      </div>
    </div>
    <div class="row lg-4 md-4 align-items-center justify-content-center">
      <div class="col-lg-4 col-md-4 col-12">
        <vee-form
          class="align-items-center"
          :validation-schema="schema"
          @submit="addExamPeriod"
        >
          <!-- ID input -->
          <!-- <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="id"
              type="text"
              :placeholder="$t('examPeriod.id')"
              v-model="examPeriod.id"
            />
            <ErrorMessage name="id" class="mb-3 text-danger" />
          </div> -->
          <!-- Name input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="name"
              type="text"
              :placeholder="$t('examPeriod.name')"
              v-model="examPeriod.name"
            />
            <ErrorMessage name="name" class="mb-3 text-danger" />
          </div>

          <!-- Start date input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="startDate"
              :placeholder="$t('examPeriod.startDate')"
              v-model="examPeriod.startDate"
            >
              <calendar
                style="margin-bottom: 0.5rem"
                v-model="examPeriod.startDate"
                :manualInput="false"
                dateFormat="dd.mm.yy"
                showIcon
              ></calendar>
            </vee-field>
            <ErrorMessage name="startDate" class="mb-3 text-danger" />
          </div>
          <!-- End date input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="endDate"
              :placeholder="$t('examPeriod.endDate')"
              v-model="examPeriod.endDate"
            >
              <calendar
                style="margin-bottom: 0.5rem"
                v-model="examPeriod.endDate"
                :manualInput="false"
                dateFormat="dd.mm.yy"
                showIcon
              ></calendar>
            </vee-field>
            <ErrorMessage name="endDate" class="mb-3 text-danger" />
          </div>
          <!-- Semester input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="active"
              as="select"
              v-model="examPeriod.active"
              :placeholder="$t('examPeriod.active')"
            >
              <option value="" disabled>
                {{ $t("examPeriod.selectActive") }}
              </option>
              <option value="0">{{ $t("examPeriod.yes") }}</option>
              <option value="1">{{ $t("examPeriod.no") }}</option>
            </vee-field>
            <ErrorMessage name="active" class="mb-3 text-danger" />
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
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { MDBBtnGroup, MDBBtn } from "mdb-vue-ui-kit";
import { environment } from "@/environments/environment";
import axios from "axios";
import Calendar from "primevue/calendar";
import moment from "moment";

export default {
  name: "AppExamPeriodForm",
  components: { MDBBtnGroup, MDBBtn, Calendar },
  setup() {
    const route = useRoute();
    const router = useRouter();

    let examPeriod = ref({});
    const schema = {
      name: "required|min:3|max:30",
      startDate: "required",
      endDate: "required",
    };
    const addExamPeriod = () => {
      examPeriod.value.id = Math.floor(Math.random() * 1000);
      examPeriod.value.startDate = moment(examPeriod.value.startDate).format(
        "DD.MM.YYYY"
      );
      examPeriod.value.endDate = moment(examPeriod.value.endDate).format(
        "DD.MM.YYYY"
      );
      axios
        .post(`${environment.serverUrl}/exam-periods`, examPeriod.value)
        .then(() => redirect())
        .catch((err) => console.log(err));
    };

    const redirect = () => {
      router.push({ name: "exam-period-list" });
    };

    return { schema, addExamPeriod, examPeriod };
  },
};
</script>
