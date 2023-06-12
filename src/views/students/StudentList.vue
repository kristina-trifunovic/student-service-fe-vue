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
        <DataTable :value="students" paginator removableSort :rows="5" :rowsPerPageOptions="[2, 3, 5, 10]" tableStyle="min-width: 50rem">
          <Column field="index.indexNumber" sortable :header="$t('student.index')">
            <template #body="slotProps">
              <p class="fw-normal mb-1">{{ slotProps.data.index.indexNumber + "/" + slotProps.data.index.indexYear }}</p>
            </template>
          </Column>
          <Column field="firstName" sortable :header="$t('student.firstName')"></Column>
          <Column field="lastName" sortable :header="$t('student.lastName')"></Column>
          <Column field="email" sortable :header="$t('student.email')"></Column>
          <Column field="city.name" sortable :header="$t('student.city')">
            <template #body="slotProps"><p class="fw-normal mb-1">{{ slotProps.data.city.name }}</p></template>
          </Column>
          <Column>
            <template #body="slotProps">
              <MDBBtnGroup>
                <MDBBtn color="light" @click="openModal(slotProps.data)">{{
                  $t("actions.view")
                }}</MDBBtn>
                <MDBBtn color="warning" @click="router.push({name: 'student-update', params: {username: slotProps.data.username} })">{{ $t("actions.edit") }}</MDBBtn>
                <MDBBtn color="danger" @click="onDelete(slotProps.data)">{{ $t("actions.delete") }}</MDBBtn>
              </MDBBtnGroup>
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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
  name: "AppStudentList",
  components: {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBBtnGroup,
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn,
    Toast,
    DataTable,
    Column
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
              life: 2000
            });
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
              life: 2000
            })
        })
        .catch((err) => toast.add({
              severity: "error",
              summary: t("messages.fail_delete", {
                componentName: t("component.student"),
              }),
              detail: err,
              life: 2000
            }))
    }

    return { students, openModal, studentToShow, viewModal, router, onDelete, deleteModal, studentToDelete, deleteStudent };
  },
};
</script>
