<template>
  <Toast />
  <MDBContainer>
    <MDBRow>
      <MDBCol
        ><h1 class="display-6 text-center m-4">
          {{ $t("exam.applyExams") }}
        </h1></MDBCol
      >
    </MDBRow>
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
                <MDBBtn color="light" @click="addExam(exam)">{{
                  $t("actions.add")
                }}</MDBBtn>
              </td>
            </tr>
          </tbody>
        </MDBTable>
      </MDBCol>
    </MDBRow>
    <MDBRow>
      <MDBCol md="4"></MDBCol>
      <MDBCol md="4"></MDBCol>
      <MDBCol md="4">
        <MDBBtnGroup style="margin-top: 1rem">
          <ConfirmDialog
            ><template #message="slotProps">
              <div class="flex">
                <i
                  :class="slotProps.message.icon"
                  style="font-size: 1.5rem"
                ></i>
                <p class="pl-2">{{ slotProps.message.message }}</p>
                <div class="d-flex justify-content-center">
                  <MDBTable class="align-middle mb-0 bg-white col-12">
                    <thead class="bg-light">
                      <tr>
                        <th>{{}}</th>
                        <th>{{}}</th>
                        <th>{{}}</th>
                        <th>{{}}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="exam in examsToApply" :key="exam.id">
                        <td>
                          <p class="fw-normal mb-1">{{ exam.subject.name }}</p>
                        </td>
                        <td>
                          <p class="fw-normal mb-1">{{ exam.examDate }}</p>
                        </td>
                        <td>
                          <p class="fw-normal mb-1">
                            {{ exam.examPeriod.name }}
                          </p>
                        </td>
                        <td>
                          <p class="fw-normal mb-1">
                            {{
                              exam.professor.firstName +
                              " " +
                              exam.professor.lastName
                            }}
                          </p>
                        </td>
                        <td>
                          <MDBBtn color="light" @click="removeExam(exam)">{{
                            $t("actions.remove")
                          }}</MDBBtn>
                        </td>
                      </tr>
                    </tbody>
                  </MDBTable>
                </div>
              </div>
            </template></ConfirmDialog
          >
          <MDBBtn color="outline" @click="confirmApplyExams()">{{
            $t("actions.apply")
          }}</MDBBtn>
          <MDBBtn color="warning" @click="rollbackSelection">{{
            $t("actions.cancel")
          }}</MDBBtn>
        </MDBBtnGroup>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>

<script>
import { onMounted, ref } from "vue";
import {
  MDBBtnGroup,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTable,
} from "mdb-vue-ui-kit";
import ConfirmDialog from "primevue/confirmdialog";
import Card from "primevue/card";
import { environment } from "@/environments/environment";
import { useI18n } from "vue-i18n";
import axios from "axios";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import Calendar from "primevue/calendar";
import useUserStore from "@/stores/user";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export default {
  name: "AppExamApply",
  components: {
    MDBBtnGroup,
    MDBBtn,
    Calendar,
    Toast,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBTable,
    ConfirmDialog,
    Card,
    DataTable,
    Column,
  },
  setup() {
    const toast = useToast();
    const confirm = useConfirm();

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
    const applyExams = () => {
      return axios.put(
        `${environment.serverUrl}/exams/${userStore.userLoggedIn.username}/apply`,
        examsToApply.value
      );
    };

    const addExam = (exam) => {
      let index = exams.value.findIndex((e) => e.id === exam.id);
      examsToApply.value.push(exam);
      exams.value.splice(index, 1);
    };

    const rollbackSelection = () => {
      exams.value.push(...examsToApply.value);
      examsToApply.value = [];
    };

    const confirmApplyExams = () => {
      confirm.require({
        message: t("exam.confirmDialog"),
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          applyExams()
            .then(() => {
              toast.add({
                severity: "success",
                summary: t("messages.success_apply_exams"),
                detail: "",
                life: 2000,
              });
              router.push({ name: "home" });
            })
            .catch((err) =>
              toast.add({
                severity: "error",
                summary: t("messages.fail_apply_exam"),
                detail: err,
                life: 2000,
              })
            );
        },
        reject: () => {},
      });
    };

    const removeExam = (exam) => {
      let i = examsToApply.value.findIndex((e) => e.id === exam.id);
      let removedExam = examsToApply.value.splice(i, 1);
      console.log(removedExam);
      exams.value.push(...removedExam);
    };

    return {
      exams,
      confirmApplyExams,
      rollbackSelection,
      addExam,
      removeExam,
      examsToApply,
    };
  },
};
</script>
