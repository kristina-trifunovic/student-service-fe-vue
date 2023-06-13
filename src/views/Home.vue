<template>
  <Toast />
  <!-- View Modal -->
  <MDBModal
    id="viewModal"
    tabindex="-1"
    labelledby="viewModal"
    v-model="viewModal"
  >
    <MDBModalHeader>{{ $t("subject.addLiterature") }}</MDBModalHeader>
    <MDBModalBody>
      <div class="container">
        <div class="row">
          <div class="col">
            <form enctype="multipart/form-data">
              <input
                type="file"
                @change="onUploadLiterature"
                name="file"
                class="form-control"
              />
            </form>
          </div>
        </div>
        <div class="row">
          <div class="col text-center">
            <MDBBtnGroup>
              <MDBBtn color="warning" @click="uploadLiteratureToSubject">
                {{ $t("actions.upload") }}
              </MDBBtn>
              <MDBBtn color="secondary" @click="viewModal = false">
                {{ $t("actions.close") }}
              </MDBBtn>
            </MDBBtnGroup>
          </div>
        </div>
      </div>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="secondary" @click="viewModal = false">
        {{ $t("actions.close") }}
      </MDBBtn>
    </MDBModalFooter>
  </MDBModal>
  <div class="container" style="margin-top: 2rem">
    <div class="row">
      <div class="col-lg-4 col-md-4">
        <div class="card mb-4">
          <div class="card-body text-center">
            <h5 class="my-3">{{ user.firstName + " " + user.lastName }}</h5>
            <p class="text-muted mb-2">{{ user.city.name }}</p>
            <p class="text-muted mb-1">{{ user.email }}</p>
          </div>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="card mb-4">
          <div class="card-body">
            <div v-show="student.index">
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">{{ $t("student.index") }}</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">
                    {{
                      student?.index?.indexNumber +
                      "/" +
                      student?.index?.indexYear
                    }}
                  </p>
                </div>
              </div>
              <hr />
            </div>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">{{ $t("student.address") }}</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0">
                  {{ user.address + ", " + user.city.name }}
                </p>
              </div>
            </div>
            <div v-show="professor.reelectionDate">
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">{{ $t("professor.phone") }}</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">{{ professor.phone }}</p>
                </div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">
                    {{ $t("professor.reelectionDate") }}
                  </p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">{{ professor.reelectionDate }}</p>
                </div>
              </div>
            </div>
            <div v-show="student.index">
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">
                    {{ $t("student.currentYearOfStudy") }}
                  </p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">
                    {{ student?.currentYearOfStudy }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mb-4" v-show="student.index">
          <div class="card-body">
            <DataTable
              :value="exams"
              removableSort
              tableStyle="min-width: 50rem"
            >
              <Column
                field="subject.name"
                sortable
                :header="$t('exam.subject')"
              ></Column>
              <Column
                field="examPeriod.name"
                sortable
                :header="$t('exam.examPeriod')"
              ></Column>
              <Column
                field="examDate"
                sortable
                :header="$t('exam.examDate')"
              ></Column>
              <caption>
                {{
                  $t("student.examList")
                }}
              </caption>
            </DataTable>
          </div>
        </div>
        <div class="card mb-4" v-show="professor.reelectionDate">
          <div class="card-body">
            <DataTable
              :value="professor.subjects"
              removableSort
              tableStyle="min-width: 50rem"
            >
              <Column field="id" sortable :header="$t('subject.id')"></Column>
              <Column
                field="name"
                sortable
                :header="$t('subject.name')"
              ></Column>
              <Column
                field="yearOfStudy"
                sortable
                :header="$t('subject.noOfEsp')"
              ></Column>
              <Column
                field="semester"
                sortable
                :header="$t('subject.semester')"
              ></Column>
              <Column>
                <template #body="slotProps">
                  <MDBBtn color="light" @click="openModal(slotProps.data)">{{
                    $t("subject.addLiterature")
                  }}</MDBBtn>
                </template>
              </Column>
              <caption>
                {{
                  $t("professor.subjectList")
                }}
              </caption>
            </DataTable>
          </div>
        </div>
        <!-- <div class="card mb-4 text-center" v-show="isAdmin">
          <div class="card-body">
            <img src="assets/pictures/chart.png" alt="graph" />
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import useUserStore from "@/stores/user";
import { environment } from "@/environments/environment";
import axios from "axios";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  Toast,
} from "mdb-vue-ui-kit";
import { useToast } from "primevue/usetoast";

export default {
  name: "AppHome",
  components: {
    DataTable,
    Column,
    MDBBtn,
    MDBBtnGroup,
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    Toast,
  },
  setup() {
    const userStore = useUserStore();
    const toast = useToast();

    let user = userStore.userLoggedIn;
    let professor = ref({});
    let student = ref({});
    let exams = ref([]);

    let subjectToAddLiterature = ref();
    let literature = ref();

    let isAdmin = true;

    onBeforeMount(() => {
      loadProfessor()
        .then((res) => {
          professor.value = res.data;
          isAdmin = false;
        })
        .catch((err) => console.log(err));
      loadStudent()
        .then((res) => {
          student.value = res.data;
          console.log(student.value);
          isAdmin = false;
        })
        .catch((err) => console.log(err));
    });

    const loadProfessor = () => {
      return axios.get(`${environment.serverUrl}/professors/${user.username}`);
    };

    const loadStudent = () => {
      return axios.get(`${environment.serverUrl}/students/${user.username}`);
    };

    const viewModal = ref(false);
    const openModal = (subject) => {
      viewModal.value = true;
      subjectToAddLiterature.value = subject;
    };

    const onUploadLiterature = (e) => {
      console.log(e);
      literature = e.target.files[0];
    };

    const uploadLiterature = () => {
      const formData = new FormData();
      formData.append("literature", literature.value);
      return axios.post(
        `${environment.serverUrl}/subjects/${subjectToAddLiterature.value.id}/literature`,
        formData
      );
    };

    const uploadLiteratureToSubject = () => {
      uploadLiterature()
        .then((res) => {
          console.log(res);
          toast.add({
            severity: "success",
            summary: t("messages.success_add_literature"),
            detail: "",
            life: 2000,
          });
        })
        .catch((err) =>
          toast.add({
            severity: "error",
            summary: t("messages.fail_add_literature"),
            detail: err,
            life: 2000,
          })
        );
    };

    return {
      user,
      professor,
      student,
      isAdmin,
      exams,
      openModal,
      literature,
      onUploadLiterature,
      uploadLiteratureToSubject,
    };
  },
};
</script>
