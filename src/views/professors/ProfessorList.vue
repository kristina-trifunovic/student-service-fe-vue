<template>
<Toast />
  <MDBContainer>
    <MDBRow>
      <MDBCol
        ><h1 class="display-6 text-center m-4">
          {{ $t("professor.listTitle") }}
        </h1></MDBCol
      >
    </MDBRow>
    <MDBRow class="d-flex justify-content-center">
      <MDBCol md="12">
        <DataTable :value="professors" removableSort tableStyle="min-width: 50rem">
          <Column field="name" sortable :header="$t('professor.name')">
            <template #body="slotProps"><p class="fw-normal mb-1">{{ slotProps.data.firstName + " " + slotProps.data.lastName }}</p></template>
          </Column>
          <Column field="email" sortable :header="$t('professor.email')"></Column>
          <Column field="phone" sortable :header="$t('professor.phone')"></Column>
          <Column field="title" sortable :header="$t('professor.title')">
            <template #body="slotProps"><p class="fw-normal mb-1">{{ slotProps.data.title.professorTitle }}</p></template>
          </Column>
          <Column>
            <template #body="slotProps">
              <MDBBtnGroup>
                <MDBBtn color="light" @click="openModal(slotProps.data)">{{
                  $t("actions.view")
                }}</MDBBtn>
                <MDBBtn color="warning" @click="router.push({name: 'professor-update', params: {username: slotProps.data.username} })">{{ $t("actions.edit") }}</MDBBtn>
                <MDBBtn color="danger" @click="onDelete(slotProps.data)">{{ $t("actions.delete") }}</MDBBtn>
              </MDBBtnGroup>
            </template>
          </Column>
        </DataTable>
        <Paginator
          :rows="pageInfo.pageSize"
          @page="onPageChange"
          :totalRecords="pageInfo.totalItems"
          :rowsPerPageOptions="pageOptions"
          class="mt-5"
          v-model:first="offset"
        />
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
        <h1 class="display-6"><small class="text-muted">{{$t('professor.name')}}: </small>{{professorToShow.firstName + " " + professorToShow.lastName}}</h1>
        <!-- <h1 class="display-6"><small class="text-muted">{{$t('professor.lastName')}}: </small>{{professorToShow.lastName}}</h1> -->
        <h1 class="display-6"><small class="text-muted">{{$t('professor.email')}}: </small>{{professorToShow.email}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('professor.address')}}: </small>{{professorToShow.address}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('professor.city')}}: </small>{{professorToShow.city.name}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('professor.phone')}}: </small>{{professorToShow.phone}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('professor.reelectionDate')}}: </small>{{professorToShow.reelectionDate}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('professor.title')}}: </small>{{professorToShow.title.professorTitle}}</h1>
        <div v-show="subjects">
          <h1 class="display-6"><small class="text-muted">{{$t('professor.subjects')}}: </small></h1>
          <h1 class="display-6" v-for="subject in subjects" :key="subject.id">&nbsp;&nbsp;{{subject.name}}</h1>
        </div>
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
    <MDBModalBody>{{$t('actions.deleteAction', {name: professorToDelete.firstName + " " + professorToDelete.lastName})}}</MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="danger" @click="deleteProfessor">{{$t('actions.yes')}}</MDBBtn>
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
  MDBListGroup,
  MDBListGroupItem
} from "mdb-vue-ui-kit";
import { ref, onMounted } from "vue";
import axios from "axios";
import { environment } from "@/environments/environment";
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';

export default {
  name: "AppProfessorList",
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
    MDBListGroup,
    MDBListGroupItem,
    Toast,
    DataTable,
    Column,
    Paginator
  },
  setup() {
    let professors = ref([]);
    let subjects = ref([])
    
    const toast = useToast();
    const { t } = useI18n();

    const pageInfo = ref({pageNo: 0, pageSize: 5, totalItems: 10, sortBy: 'firstName', sortOrder:'asc'});
    const offset = ref(0);
    const pageOptions = [2, 3, 5, 10]

    const loadProfessors = (pageInfo) => {
      const params = new URLSearchParams();
      params.append('pageNo', pageInfo.pageNo);
      params.append('pageSize', pageInfo.pageSize);
      params.append('sortBy', pageInfo.sortBy);
      params.append('sortOrder', pageInfo.sortOrder);
      axios.get(`${environment.serverUrl}/professors/page`, {params: params})
        .then((res) => {
          professors.value = res.data.content;
          pageInfo.totalItems = res.data.totalElements;
          pageInfo.pageSize = res.data.size;
          pageInfo.pageNo = res.data.number;
          toast.add({
              severity: "success",
              summary: t("messages.success_load", {
                componentName: t("component.professorPlural"),
              }),
              detail: "",
              life: 2000
            });
        })
        .catch((err) => toast.add({
              severity: "error",
              summary: t("messages.fail_load", {
                componentName: t("component.professorPlural"),
              }),
              detail: err,
              life: 2000
            })
          )
    };

    onMounted(() => {
      loadProfessors(pageInfo.value)  
    });

    const onPageChange = (page) => {
      offset.value = page.rows * page.page;
      pageInfo.value.pageSize = page.rows
      pageInfo.value.pageNo = page.page
      loadProfessors(pageInfo.value)
    }

    const loadProfessorsSubjects = (professorUsername) => {
      return axios.get(`${environment.serverUrl}/subjects/${professorUsername}/subjects`);
    }

    const viewModal = ref(false);
    const professorToShow = ref({});
    const openModal = (professor) => {
      professorToShow.value = professor;
      viewModal.value = true;
      loadProfessorsSubjects(professor.username)
        .then((res) => {
          subjects.value = res.data
          })
        .catch((err) => toast.add({
              severity: "error",
              summary: t("messages.fail_load", {
                componentName: t("component.subjectPlural"),
              }),
              detail: err,
              life: 2000
            })
        )
    };

    const router = useRouter();

    const deleteModal = ref(false);
    const professorToDelete = ref({})
    const onDelete = (professor) => {
      professorToDelete.value = professor;
      deleteModal.value = true;
    }
    const deleteProfessor = () => {
      axios.delete(`${environment.serverUrl}/professors/${professorToDelete.value.username}`)
        .then(() => {
          const deletedProfessorIndex = professors.value.findIndex(professor => professor.username == professorToDelete.value.username)
          professors.value.splice(deletedProfessorIndex, 1)
          deleteModal.value = false;
          toast.add({
              severity: "success",
              summary: t("messages.success_delete", {
                componentName: t("component.professor"),
              }),
              detail: "",
              life: 2000
            })
        })
        .catch((err) => toast.add({
              severity: "error",
              summary: t("messages.fail_delete", {
                componentName: t("component.professor"),
              }),
              detail: err,
              life: 2000
            }))
    }

    return { professors, openModal, professorToShow, viewModal, router, onDelete, deleteModal, professorToDelete, deleteProfessor, subjects, pageOptions, pageInfo, onPageChange, offset };
  },
};
</script>
