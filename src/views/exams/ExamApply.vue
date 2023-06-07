<template>
  <Toast />
  <div class="container">
    <div class="row lg-12 md-12 align-items-center justify-content-center">
      <div class="col-lg-12 col-md-12 col-12">
        <h1 class="display-6 text-center m-4">
          {{ $t("exam.applyExams") }}
        </h1>
      </div>
    </div>
    <!-- <div class="row lg-12 md-12 align-items-center justify-content-center">
      <div class="col-lg-12 col-md-12 col-12"> -->
    <!-- <MDBContainer> -->
    <MDBRow class="d-flex justify-content-center">
      <MDBCol md="12">
        <MDBTable class="align-middle mb-0 bg-white col-12">
          <thead class="bg-light">
            <tr>
              <th>{{ $t("exam.subject") }}</th>
              <th>{{ $t("exam.examDate") }}</th>
              <th>{{ $t("exam.examPeriod") }}</th>
              <th>{{ $t("exam.professor") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exam in exams" :key="exam.id">
              <td>
                <p class="fw-normal mb-1">{{ exam.subject.name }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ exam.examDate }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ exam.examPeriod.name }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">
                  {{ exam.professor.firstName + " " + exam.professor.lastName }}
                </p>
              </td>
              <td>
                <MDBBtn color="light" @click="examsToApply.push(exam)">{{
                  $t("actions.add")
                }}</MDBBtn>
              </td>
            </tr>
          </tbody>
        </MDBTable>
      </MDBCol>
    </MDBRow>
    <!-- </MDBContainer> -->

    <!-- Submit button -->
    <MDBBtnGroup class="d-flex justify-content-center">
      <MDBBtn color="outline" type="submit">{{ $t("actions.apply") }}</MDBBtn>
      <MDBBtn color="warning" @click="examsToApply = []">{{
        $t("actions.cancel")
      }}</MDBBtn>
    </MDBBtnGroup>
    <!-- </div>
    </div> -->
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { MDBBtnGroup, MDBBtn } from "mdb-vue-ui-kit";
import { environment } from "@/environments/environment";
import { useI18n } from "vue-i18n";
import axios from "axios";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import Calendar from "primevue/calendar";
import useUserStore from "@/stores/user";

export default {
  name: "AppExamForm",
  components: { MDBBtnGroup, MDBBtn, Calendar, Toast },
  setup() {
    const toast = useToast();
    const { t } = useI18n();
    const userStore = useUserStore();

    let exams = ref([]);
    const loadExams = () => {
      return axios.get(
        `${environment.serverUrl}/exams/${userStore.userLoggedIn.username}/to-apply-to`
      );
    };

    onMounted(() => {
      loadExams()
        .then((res) => (exams.value = res.data))
        .catch((err) =>
          toast.add({
            severity: "error",
            summary: t("messages.fail_load", {
              componentName: t("component.examPlural"),
            }),
            detail: err,
            life: 2000,
          })
        );
    });

    let examsToApply = ref([]);
    const applyExam = () => {
      axios
        .post(
          `${environment.serverUrl}/exams/${userStore.userLoggedIn.username}/apply`,
          examsToApply.value
        )
        .then(() =>
          toast.add({
            severity: "success",
            summary: t("messages.success_apply_exams"),
            detail: "",
            life: 2000,
          })
        )
        .catch((err) =>
          toast.add({
            severity: "error",
            summary: t("messages.fail_apply_exam"),
            detail: err,
            life: 2000,
          })
        );
    };

    return { exams, applyExam };
  },
};
</script>
