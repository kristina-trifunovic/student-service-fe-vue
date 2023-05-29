<template>
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
        <MDBTable class="align-middle mb-0 bg-white col-12">
          <thead class="bg-light">
            <tr>
              <th>{{ $t("professor.name") }}</th>
              <th>{{ $t("professor.email") }}</th>
              <th>{{ $t("professor.phone") }}</th>
              <th>{{ $t("professor.title") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="professor in professors" :key="professor.id">
              <td>
                <p class="fw-normal mb-1">{{ professor.firstName + " " + professor.lastName }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ professor.email }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ professor.phone }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ professor.title.professorTitle }}</p>
              </td>
              <td>
                <MDBBtnGroup>
                  <MDBBtn color="light" @click="openModal(professor)">{{
                    $t("actions.view")
                  }}</MDBBtn>
                  <MDBBtn color="warning" @click="router.push({name: 'professor-update', params: {username: professor.username} })">{{ $t("actions.edit") }}</MDBBtn>
                  <MDBBtn color="danger" @click="onDelete(professor)">{{ $t("actions.delete") }}</MDBBtn>
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
    MDBListGroupItem
  },
  setup() {
    let professors = ref([]);
    let subjects = ref([])

    const loadProfessors = () => {
      return axios.get(`${environment.serverUrl}/professors`);
    };

    onBeforeMount(() => {
      loadProfessors()
        .then((res) => {
          professors.value = res.data;
        })
        // TODO add a popup
        .catch((err) => console.log("error happened", err));
    });

    const loadProfessorsSubjects = (professorUsername) => {
      return axios.get(`${environment.serverUrl}/subjects/${professorUsername}/subjects`);
    }

    const viewModal = ref(false);
    const professorToShow = ref({});
    const openModal = (professor) => {
      professorToShow.value = professor;
      const day = (Number(professor.reelectionDate.slice(0, 2)) + 1).toString()
      professorToShow.value.reelectionDate = day + professor.reelectionDate.slice(-8)
      viewModal.value = true;
      loadProfessorsSubjects(professor.username)
        .then((res) => {
          subjects.value = res.data
          })
        .catch((err) => console.log(err));
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
        })
        .catch((err) => console.log('error happened', err))
    }

    return { professors, openModal, professorToShow, viewModal, router, onDelete, deleteModal, professorToDelete, deleteProfessor, subjects };
  },
};
</script>
