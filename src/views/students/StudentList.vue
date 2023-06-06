<template>
<Toast />
  <MDBContainer>
    <MDBRow>
      <MDBCol
        ><h1 class="display-6 text-center m-4">
          {{ $t("student.listTitle") }}
        </h1></MDBCol
      >
    </MDBRow>
    <MDBRow class="d-flex justify-content-center">
      <MDBCol md="12">
        <MDBTable class="align-middle mb-0 bg-white col-12">
          <thead class="bg-light">
            <tr>
              <th>{{ $t("student.index") }}</th>
              <th>{{ $t("student.firstName") }}</th>
              <th>{{ $t("student.lastName") }}</th>
              <th>{{ $t("student.email") }}</th>
              <th>{{ $t("student.city") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student">
              <td>
                <p class="fw-normal mb-1">{{ student.index.indexNumber + "/" + student.index.indexYear }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ student.firstName }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ student.lastName }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ student.email }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ student.city.name }}</p>
              </td>
              <td>
                <MDBBtnGroup>
                  <MDBBtn color="light" @click="openModal(student)">{{
                    $t("actions.view")
                  }}</MDBBtn>
                  <MDBBtn color="warning" @click="router.push({name: 'student-update', params: {username: student.username} })">{{ $t("actions.edit") }}</MDBBtn>
                  <MDBBtn color="danger" @click="onDelete(student)">{{ $t("actions.delete") }}</MDBBtn>
                </MDBBtnGroup>
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
        <h1 class="display-6"><small class="text-muted">{{$t('student.index')}}: </small>{{studentToShow.index.indexNumber + "/" + studentToShow.index.indexYear}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('student.firstName')}}: </small>{{studentToShow.firstName}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('student.lastName')}}: </small>{{studentToShow.lastName}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('student.email')}}: </small>{{studentToShow.email}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('student.currentYearOfStudy')}}: </small>{{studentToShow.currentYearOfStudy}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('student.city')}}: </small>{{studentToShow.city.name}}</h1>
      </p>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="secondary" @click="viewModal = false">
        {{ $t("actions.close") }}
      </MDBBtn>
    </MDBModalFooter>
  </MDBModal>

  <!-- Delete modal -->
  <MDBModal
    id="deleteModal"
    tabindex="-1"
    labelledby="deleteModal"
    v-model="deleteModal"
  >
    <MDBModalHeader>
      <MDBModalTitle id="deleteModal"> {{$t('actions.deleting')}} </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>{{$t('actions.deleteAction', {name: studentToDelete.firstName + " " + studentToDelete.lastName})}}</MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="danger" @click="deleteStudent">{{$t('actions.yes')}}</MDBBtn>
      <MDBBtn color="outline" @click="deleteModal = false">{{$t('actions.no')}}</MDBBtn>
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
} from "mdb-vue-ui-kit";
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { environment } from "@/environments/environment";
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import Toast from 'primevue/toast';

export default {
  name: "AppStudentList",
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
    Toast
  },
  setup() {
    let students = ref([]);

    const toast = useToast();
    const { t } = useI18n();

    const loadStudents = () => {
      return axios.get(`${environment.serverUrl}/students`);
    };

    onBeforeMount(() => {
      loadStudents()
        .then((res) => {
          students.value = res.data;
          toast.add({
              severity: "success",
              summary: t("messages.success_load", {
                componentName: t("component.studentPlural"),
              }),
              detail: "",
              life: 3000
            });
        })
        .catch((err) => toast.add({
              severity: "error",
              summary: t("messages.fail_load", {
                componentName: t("component.studentPlural"),
              }),
              detail: err,
              life: 3000
            })
          )
    });

    const viewModal = ref(false);
    const studentToShow = ref({});
    const openModal = (student) => {
      studentToShow.value = student;
      viewModal.value = true;
    };

    const router = useRouter();

    const deleteModal = ref(false);
    const studentToDelete = ref({})
    const onDelete = (student) => {
      studentToDelete.value = student;
      deleteModal.value = true;
    }
    const deleteStudent = () => {
      axios.delete(`${environment.serverUrl}/students/${studentToDelete.value.username}`)
        .then(() => {
          const deletedStudentIndex = students.value.findIndex(student => student.username == studentToDelete.value.username)
          students.value.splice(deletedStudentIndex, 1)
          deleteModal.value = false;
          toast.add({
              severity: "success",
              summary: t("messages.success_delete", {
                componentName: t("component.student"),
              }),
              detail: "",
              life: 3000
            })
        })
        .catch((err) => toast.add({
              severity: "error",
              summary: t("messages.fail_delete", {
                componentName: t("component.student"),
              }),
              detail: err,
              life: 3000
            }))
    }

    return { students, openModal, studentToShow, viewModal, router, onDelete, deleteModal, studentToDelete, deleteStudent };
  },
};
</script>
