<template>
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
        <MDBTable class="align-middle mb-0 bg-white col-12">
          <thead class="bg-light">
            <tr>
              <th>{{ $t("subject.id") }}</th>
              <th>{{ $t("subject.name") }}</th>
              <th>{{ $t("subject.noOfESP") }}</th>
              <th>{{ $t("subject.yearOfStudy") }}</th>
              <th>{{ $t("subject.semester") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="subject in subjects" :key="subject.id">
              <td>
                <p class="fw-normal mb-1">{{ subject.id }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ subject.name }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ subject.noOfEsp }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ subject.yearOfStudy }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ subject.semester }}</p>
              </td>
              <td>
                <MDBBtnGroup>
                  <MDBBtn color="light" @click="openModal(subject)">{{
                    $t("actions.view")
                  }}</MDBBtn>
                  <MDBBtn color="warning" @click="router.push({name: 'subject-update', params: {id: subject.id} })">{{ $t("actions.edit") }}</MDBBtn>
                  <MDBBtn color="danger" @click="onDelete(subject)">{{ $t("actions.delete") }}</MDBBtn>
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
        <h1 class="display-6"><small class="text-muted">{{$t('subject.id')}}: </small>{{subjectToShow.id}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('subject.name')}}: </small>{{subjectToShow.name}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('subject.noOfESP')}}: </small>{{subjectToShow.noOfEsp}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('subject.yearOfStudy')}}: </small>{{subjectToShow.yearOfStudy}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('subject.semester')}}: </small>{{subjectToShow.semester}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('subject.description')}}: </small>{{subjectToShow.description}}</h1>
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
  },
  setup() {
    let subjects = ref([]);

    const loadSubjects = () => {
      return axios.get(`${environment.serverUrl}/subjects`);
    };

    onBeforeMount(() => {
      loadSubjects()
        .then((res) => {
          subjects.value = res.data;
        })
        // TODO add a popup
        .catch((err) => console.log("error happened", err));
    });

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
        })
        .catch((err) => console.log('error happened', err))
    }

    return { subjects, openModal, subjectToShow, viewModal, router, onDelete, deleteModal, subjectToDelete, deleteSubject };
  },
};
</script>
