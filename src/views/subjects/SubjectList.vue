<template>
  <Toast />
  <MDBContainer>
    <MDBRow>
      <MDBCol
        ><h1 class="display-6 text-center m-4">
          {{ $t("subject.listTitle") }}
        </h1></MDBCol
      >
    </MDBRow>
    <MDBRow class="d-flex justify-content-center">
      <MDBCol md="12">
        <DataTable :value="subjects" removableSort tableStyle="min-width: 50rem">
          <Column field="id" sortable :header="$t('subject.id')"></Column>
          <Column field="name" sortable :header="$t('subject.name')"></Column>
          <Column field="noOfEsp" sortable :header="$t('subject.noOfEsp')"></Column>
          <Column field="yearOfStudy" sortable :header="$t('subject.yearOfStudy')"></Column>
          <Column field="semester" sortable :header="$t('subject.semester')"></Column>
          <Column>
            <template #body="slotProps">
              <MDBBtnGroup>
                <MDBBtn color="light" @click="openModal(slotProps.data)">{{
                  $t("actions.view")
                }}</MDBBtn>
                <MDBBtn color="warning" @click="router.push({name: 'student-update', params: {id: slotProps.data.id} })">{{ $t("actions.edit") }}</MDBBtn>
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
        <h1 class="display-6"><small class="text-muted">{{$t('subject.id')}}: </small>{{subjectToShow.id}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('subject.name')}}: </small>{{subjectToShow.name}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('subject.noOfEsp')}}: </small>{{subjectToShow.noOfEsp}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('subject.yearOfStudy')}}: </small>{{subjectToShow.yearOfStudy}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('subject.semester')}}: </small>{{ $t(`subject.${subjectToShow.semester}`) }}</h1>
        <h1 class="display-6" v-show="subjectToShow.description"><small class="text-muted">{{$t('subject.description')}}: </small>{{subjectToShow.description}}</h1>
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
    <MDBModalBody>{{$t('actions.deleteAction', {name: subjectToDelete.name})}}</MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="danger" @click="deleteSubject">{{$t('actions.yes')}}</MDBBtn>
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
import { ref, onBeforeMount, onMounted } from "vue";
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
  name: "AppSubjectList",
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
    Column,
    Paginator
  },
  setup() {
    let subjects = ref([]);

    const toast = useToast();
    const { t } = useI18n();

    const pageInfo = ref({pageNo: 0, pageSize: 5, totalItems: 6, sortBy: 'id', sortOrder:'asc'});
    const offset = ref(0);
    const pageOptions = [2, 3, 5, 10]

    const loadSubjects = (pageInfo) => {
      const params = new URLSearchParams();
      params.append('pageNo', pageInfo.pageNo);
      params.append('pageSize', pageInfo.pageSize);
      params.append('sortBy', pageInfo.sortBy);
      params.append('sortOrder', pageInfo.sortOrder);
      axios.get(`${environment.serverUrl}/subjects/page`, {params: params})
        .then((res) => {
          subjects.value = res.data.content;
          toast.add({
              severity: "success",
              summary: t("messages.success_load", {
                componentName: t("component.subjectPlural"),
              }),
              detail: "",
              life: 2000
            });
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

    onMounted(() => {
      loadSubjects(pageInfo.value)        
    });

    const onPageChange = (page) => {
      offset.value = page.rows * page.page;
      pageInfo.value.pageSize = page.rows
      pageInfo.value.pageNo = page.page
      loadSubjects(pageInfo.value)
    }

    const viewModal = ref(false);
    const subjectToShow = ref({});
    const openModal = (city) => {
      subjectToShow.value = city;
      viewModal.value = true;
    };

    const router = useRouter();

    const deleteModal = ref(false);
    const subjectToDelete = ref({})
    const onDelete = (student) => {
      subjectToDelete.value = student;
      deleteModal.value = true;
    }
    const deleteSubject = () => {
      axios.delete(`${environment.serverUrl}/subjects/${subjectToDelete.value.id}`)
        .then(() => {
          const deletedSubjectIndex = subjects.value.findIndex(subject => subject.id == subjectToDelete.value.id)
          subjects.value.splice(deletedSubjectIndex, 1)
          deleteModal.value = false;
          toast.add({
              severity: "success",
              summary: t("messages.success_delete", {
                componentName: t("component.subject"),
              }),
              detail: "",
              life: 2000
            })
        })
        .catch((err) => toast.add({
              severity: "error",
              summary: t("messages.fail_delete", {
                componentName: t("component.subject"),
              }),
              detail: err,
              life: 2000
            }))
    }

    return { subjects, openModal, subjectToShow, viewModal, router, onDelete, deleteModal, subjectToDelete, deleteSubject, pageOptions, pageInfo, onPageChange, offset };
  },
};
</script>
