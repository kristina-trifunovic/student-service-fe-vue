<template>
<Toast />
  <MDBContainer>
    <MDBRow>
      <MDBCol
        ><h1 class="display-6 text-center m-4">
          {{ $t("exam.listTitle") }}
        </h1></MDBCol
      >
    </MDBRow>
    <MDBRow class="d-flex justify-content-center">
      <MDBCol md="12">
        <DataTable :value="exams" tableStyle="min-width: 50rem">
            <Column field="subject.name" :header="$t('exam.subject')"></Column>
            <Column field="examDate" :header="$t('exam.examDate')"></Column>
            <Column field="examPeriod.name" :header="$t('exam.examPeriod')"></Column>
            <Column>
              <template #body="slotProps">
                <MDBBtn color="light" @click="openModal(slotProps.data)">{{
                    $t("actions.view")
                  }}</MDBBtn>
            </template>
            </Column>
        </DataTable>
      </MDBCol>
    </MDBRow>
  </MDBContainer>

  <!-- View Modal -->
  <MDBModal
    id="viewModal"
    tabindex="-1"
    labelledby="viewModal"
    v-model="viewModal"
    size="lg"
  >
  <MDBModalHeader></MDBModalHeader>
    <MDBModalBody>
      <p style="margin-left: 2em;">
        <h3><small class="text-muted">{{$t('exam.subject')}}: </small>{{examToShow.subject.name}}</h3>
        <h3><small class="text-muted">{{$t('exam.examDate')}}: </small>{{examToShow.examDate}}</h3>
        <h3><small class="text-muted">{{$t('exam.examPeriod')}}: </small>{{examToShow.examPeriod.name}}</h3>
        <h3><small class="text-muted">{{$t('exam.professor')}}: </small>{{examToShow.professor.firstName + " " + examToShow.professor.lastName}}</h3>
        <DataTable :value="studentsGrades" v-model:editingRows="editingRows" @row-edit-save="onRowEditSave" tableClass="editable-cells-table"
                    editMode="row" tableStyle="min-width: 35rem" v-show="studentsGrades.length != 0">
             <Column :header="$t('student.name')">
              <template #body="slotProps">
                <p class="fw-normal mb-1">{{ slotProps.data.student.firstName + " " + slotProps.data.student.lastName }}</p>
              </template>
            </Column>
            <Column field="grade" :header="$t('exam.grade')" style="width: 20%">
              <template #body="{ data }">
                  {{ data.grade }}
              </template>
              <template #editor="{ data }">
                  <InputNumber v-model="data.grade" />
              </template>
            </Column>
            <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>





            <!-- <Column :header="$t('exam.grade')">
              <template #body="slotProps">
                <InputNumber :disabled="!slotProps.data" v-model="examToShow.grade" inputId="minmax" :min="5" :max="10" />
              </template>
            </Column>
            <Column>
              <template #body>
                <MDBBtn color="warning" @click="saveGrade(examToShow)">
                  {{ $t("actions.save") }}
                </MDBBtn>
              </template>
            </Column> -->
        </DataTable>
      </p>
    </MDBModalBody>
    <MDBModalFooter>
      <!-- <MDBBtnGroup>
        <MDBBtn color="warning" @click="saveGrade(examToShow)">
          {{ $t("actions.save") }}
        </MDBBtn> -->
        <MDBBtn color="secondary" @click="viewModal = false">
          {{ $t("actions.close") }}
        </MDBBtn>
      <!-- </MDBBtnGroup> -->
    </MDBModalFooter>
  </MDBModal>
</template>

<script>
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTable,
  MDBBtn,
  MDBBtnGroup,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBListGroup,
  MDBListGroupItem
} from "mdb-vue-ui-kit";
import { ref, onBeforeMount } from "vue";
import useUserStore from '@/stores/user'
import axios from "axios";
import { environment } from "@/environments/environment";
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import Toast from 'primevue/toast';
import InputNumber from 'primevue/inputnumber';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
  name: "AppProfessorList",
  components: {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBTable,
    MDBBtn,
    MDBBtnGroup,
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn,
    MDBListGroup,
    MDBListGroupItem,
    Toast,
    InputNumber,
    DataTable,
    Column
  },
  setup() {
    let exams = ref([]);
    let studentsGrades = ref([])
    const editingRows = ref([]);
    
    const toast = useToast();
    const { t } = useI18n();
    const userStore = useUserStore();

    onBeforeMount(() => {
      loadProfessorsExams()
        .then((res) => {
          exams.value = res.data;
          toast.add({
              severity: "success",
              summary: t("messages.success_load", {
                componentName: t("component.examPlural"),
              }),
              detail: "",
              life: 2000
            });
        })
        .catch((err) => toast.add({
              severity: "error",
              summary: t("messages.fail_load", {
                componentName: t("component.examPlural"),
              }),
              detail: err,
              life: 2000
            })
          )
    });

    const loadProfessorsExams = () => {
      return axios.get(`${environment.serverUrl}/exams/${userStore.userLoggedIn.username}`);
    }

    const loadStudentsFromExamToShow = (exam) => {
      return axios.get(`${environment.serverUrl}/students/exams/${userStore.userLoggedIn.username}/${exam.id.examPeriodId}/${exam.id.subjectId}`);
    }

    const loadStudentExamsByProfessor = () => {
      return axios.get(`${environment.serverUrl}/student-takes-exam/${userStore.userLoggedIn.username}`);
    }

    const saveGrade = (exam, grade, studentUsername) => {
      return axios.put(`${environment.serverUrl}/student-takes-exam/${grade}/${studentUsername}`, exam);
    }

    const onRowEditSave = (event) => {
      let { newData, index } = event;
      studentsGrades.value[index] = newData;
      saveGrade(examToShow.value, newData.grade, newData.student.username)
        .then(() => {
          toast.add({
              severity: "success",
              summary: t("messages.success_update", {
                componentName: t("component.grade"),
              }),
              detail: "",
              life: 2000
            })
        })
        .catch((err) => toast.add({
              severity: "error",
              summary: t("messages.fail_update", {
                componentName: t("component.grade"),
              }),
              detail: err,
              life: 2000
            })
          )
    };

    const viewModal = ref(false);
    const examToShow = ref({});
    const openModal = (exam) => {
      studentsGrades.value = []
      examToShow.value = exam;
      viewModal.value = true;
      let studentExam = ref([])
      loadStudentExamsByProfessor()
        .then((res) => {
          studentExam.value = res.data
          loadStudentsFromExamToShow(examToShow.value)
          .then((res) => {
            for (let i = 0; i < res.data.length; i++) {
              let grade = studentExam.value.filter(se => se.exam.professor.username == userStore.userLoggedIn.username && se.student.username == res.data[i].username)[0].grade
              studentsGrades.value.push({student: res.data[i], grade: grade})
            }
          })
          .catch((err) => toast.add({
                severity: "error",
                summary: t("messages.fail_load", {
                  componentName: t("component.studentPlural"),
                }),
                detail: err,
                life: 2000
              })
            )
      })
    };

    const router = useRouter();


    return { exams, openModal, examToShow, viewModal, router, saveGrade, studentsGrades, editingRows, onRowEditSave };
  },
};
</script>
