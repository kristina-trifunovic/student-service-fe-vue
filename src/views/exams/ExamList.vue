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
        <MDBTable class="align-middle mb-0 bg-white col-12">
          <thead class="bg-light">
            <tr>
              <th>{{ $t("exam.subject") }}</th>
              <th>{{ $t("exam.examDate") }}</th>
              <th>{{ $t("exam.examPeriod") }}</th>
              <th>{{ $t("exam.professor") }}</th>
              <th>{{ $t("exam.student") }}</th>
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
                <p class="fw-normal mb-1">{{ exam.professor.firstName + " " + exam.professor.lastName }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ exam.student ? exam.student.firstName + " " + exam.student.lastName : "/" }}</p>
              </td>
              <td>                
                  <MDBBtn color="light" @click="openModal(exam)">{{
                    $t("actions.view")
                  }}</MDBBtn>
              </td>
            </tr>
          </tbody>
        </MDBTable>
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
        <h1 class="display-6"><small class="text-muted">{{$t('exam.subject')}}: </small>{{examToShow.subject.name}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('exam.examDate')}}: </small>{{examToShow.examDate}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('exam.examPeriod')}}: </small>{{examToShow.examPeriod.name}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('exam.professor')}}: </small>{{examToShow.professor.firstName + " " + examToShow.professor.lastName}}</h1>
        <h1 class="display-6" v-show="examToShow.student"><small class="text-muted">{{$t('exam.professor')}}: </small>{{ examToShow.student ? examToShow.student.firstName + " " + examToShow.student.lastName : ""}}</h1>
        <div class="flex-auto">
            <label for="minmax" class="font-bold block mb-2" style="margin-right: 1rem"> {{$t('exam.grade')}} </label>
            <InputNumber :disabled="!examToShow.student" v-model="examToShow.grade" inputId="minmax" :min="5" :max="10" />
        </div>
      </p>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtnGroup>
        <MDBBtn color="warning" @click="saveGrade(examToShow)">
          {{ $t("actions.save") }}
        </MDBBtn>
        <MDBBtn color="secondary" @click="viewModal = false">
          {{ $t("actions.close") }}
        </MDBBtn>
      </MDBBtnGroup>
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
import axios from "axios";
import { environment } from "@/environments/environment";
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import Toast from 'primevue/toast';
import InputNumber from 'primevue/inputnumber';

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
    InputNumber
  },
  setup() {
    let exams = ref([]);
    
    const toast = useToast();
    const { t } = useI18n();

    onBeforeMount(() => {
      loadExams()
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

    const loadExams = () => {
      return axios.get(`${environment.serverUrl}/exams`);
    }

    const saveGrade = (exam) => {
      return axios.put(`${environment.serverUrl}/exams`, exam);
    }

    const viewModal = ref(false);
    const examToShow = ref({});
    const openModal = (exam) => {
      examToShow.value = exam;
      viewModal.value = true;
    };

    const router = useRouter();


    return { exams, openModal, examToShow, viewModal, router, saveGrade };
  },
};
</script>
