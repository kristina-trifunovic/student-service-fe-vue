<template>
  <Toast />
  <div class="container">
    <div class="row lg-6 md-6 align-items-center justify-content-center">
      <div class="col-lg-6 col-md-6 col-12">
        <h1 class="display-6 text-center m-4">
          {{ $t("exam.addTitle") }}
        </h1>
      </div>
    </div>
    <div class="row lg-4 md-4 align-items-center justify-content-center">
      <div class="col-lg-4 col-md-4 col-12">
        <vee-form
          class="align-items-center"
          :validation-schema="schema"
          @submit="addExam"
        >
          <!-- Professor select -->
          <div class="row">
            <label>{{ $t("exam.professor") }}</label>
            <div class="d-flex flex-column">
              <vee-field
                name="professor"
                :placeholder="$t('exam.professor')"
                v-model="exam.professor"
              >
                <select v-model="exam.professor" class="form-control mb-2">
                  <option
                    v-for="professor in professors"
                    :key="professor.username"
                    :value="professor"
                  >
                    {{ professor.firstName + " " + professor.lastName }}
                  </option>
                </select>
              </vee-field>
              <ErrorMessage name="professor" class="mb-3 text-danger" />
            </div>
          </div>

          <!-- Subject select -->
          <div class="row">
            <label>{{ $t("exam.subject") }}</label>
            <div class="d-flex flex-column">
              <vee-field
                name="subject"
                :placeholder="$t('exam.subject')"
                v-model="exam.subject"
              >
                <select v-model="exam.subject" class="form-control mb-2">
                  <option
                    v-for="subject in subjects"
                    :key="subject.username"
                    :value="subject"
                  >
                    {{ subject.name }}
                  </option>
                </select>
              </vee-field>
              <ErrorMessage name="subject" class="mb-3 text-danger" />
            </div>
          </div>

          <!-- Exam period select -->
          <div class="row">
            <label>{{ $t("exam.examPeriod") }}</label>
            <div class="d-flex flex-column">
              <vee-field
                name="examPeriod"
                :placeholder="$t('exam.examPeriod')"
                v-model="exam.examPeriod"
              >
                <select v-model="exam.examPeriod" class="form-control mb-2">
                  <option
                    v-for="examPeriod in examPeriods"
                    :key="examPeriod.id"
                    :value="examPeriod"
                  >
                    {{ examPeriod.name }}
                  </option>
                </select>
              </vee-field>
              <ErrorMessage name="examPeriod" class="mb-3 text-danger" />
            </div>
          </div>

          <!-- Grade input -->
          <div class="d-flex flex-column">
            <vee-field
              class="form-control mb-2"
              style="padding-top: 1rem"
              name="grade"
              type="number"
              :placeholder="$t('exam.grade')"
              v-model="exam.grade"
            />
            <ErrorMessage name="grade" class="mb-3 text-danger" />
          </div>

          <!-- Exam Date input -->
          <div class="row">
            <label>{{ $t("exam.examDate") }}</label>
            <div class="d-flex flex-column">
              <vee-field
                class="form-control mb-2"
                name="examDate"
                v-model="exam.examDate"
                :placeholder="$t('exam.examDate')"
              >
                <calendar
                  style="margin-bottom: 0.5rem"
                  v-model="exam.examDate"
                  :manualInput="false"
                  dateFormat="dd.mm.yy"
                  showIcon
                ></calendar>
              </vee-field>
              <ErrorMessage name="examDate" class="mb-3 text-danger" />
            </div>
          </div>

          <!-- Submit button -->
          <MDBBtnGroup class="d-flex justify-content-center">
            <MDBBtn color="outline" type="submit">{{
              $t("actions.save")
            }}</MDBBtn>
            <MDBBtn color="warning" @click="exam = {}">{{
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
import { MDBBtnGroup, MDBBtn } from "mdb-vue-ui-kit";
import { environment } from "@/environments/environment";
import { useI18n } from "vue-i18n";
import axios from "axios";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import Calendar from "primevue/calendar";
import moment from "moment";

export default {
  name: "AppExamForm",
  components: { MDBBtnGroup, MDBBtn, Calendar, Toast },
  setup() {
    const toast = useToast();
    const { t } = useI18n();

    let exam = ref({});
    const schema = {
      professor: "required",
      examPeriod: "required",
      subject: "required",
      examDate: "required",
      grade: "min_value:5|max_value:10",
    };

    let professors = ref([]);
    const loadProfessors = () => {
      return axios.get(`${environment.serverUrl}/professors`);
    };

    let subjects = ref([]);
    const loadSubjects = () => {
      return axios.get(`${environment.serverUrl}/subjects`);
    };

    let examPeriods = ref([]);
    const loadExamPeriods = () => {
      return axios.get(`${environment.serverUrl}/exam-periods`);
    };

    onMounted(() => {
      loadProfessors()
        .then((res) => (professors.value = res.data))
        .catch((err) =>
          toast.add({
            severity: "error",
            summary: t("messages.fail_load", {
              componentName: t("component.professorPlural"),
            }),
            detail: err,
            life: 2000,
          })
        );
      loadSubjects()
        .then((res) => (subjects.value = res.data))
        .catch((err) =>
          toast.add({
            severity: "error",
            summary: t("messages.fail_load", {
              componentName: t("component.subjectPlural"),
            }),
            detail: err,
            life: 2000,
          })
        );
      loadExamPeriods()
        .then((res) => (examPeriods.value = res.data))
        .catch((err) =>
          toast.add({
            severity: "error",
            summary: t("messages.fail_load", {
              componentName: t("component.examPeriodPlural"),
            }),
            detail: err,
            life: 2000,
          })
        );
    });

    const addExam = () => {
      exam.value.id = {
        professorUsername: exam.value.professor.username,
        subjectId: exam.value.subject.id,
        examPeriodId: exam.value.examPeriod.id,
      };
      exam.value.examDate = moment(exam.value.examDate).format("DD.MM.YYYY");
      axios
        .post(`${environment.serverUrl}/exams`, exam.value)
        .then(() =>
          toast.add({
            severity: "success",
            summary: t("messages.success_add", {
              componentName: t("component.exam"),
            }),
            detail: "",
            life: 2000,
          })
        )
        .catch((err) =>
          toast.add({
            severity: "error",
            summary: t("messages.fail_add", {
              componentName: t("component.exam"),
            }),
            detail: err,
            life: 2000,
          })
        );
    };

    return { schema, addExam, exam, professors, subjects, examPeriods };
  },
};
</script>
