<template>
  <Toast />
  <!-- Literature Modal -->
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
        <div class="row" style="margin-top: 1em">
          <div class="col text-center">
            <MDBBtnGroup>
              <MDBBtn
                color="warning"
                @click="uploadLiteratureToSubject"
                :disabled="!literature"
              >
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
    <MDBModalFooter></MDBModalFooter>
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
            <hr v-show="isAdmin" />
            <div class="row" v-show="isAdmin">
              <div class="col-sm-3">
                <p class="mb-0">{{ $t("student.city") }}</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0">
                  {{ user.city.postalCode + ", " + user.city.name }}
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
      </div>
    </div>
    <div class="row" v-show="isAdmin">
      <div class="card mb-4 text-center">
        <div class="card-body">
          <img src="@/assets/chart.png" alt="graph" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card mb-4" v-show="student.index">
          <div class="card-body">
            <DataTable
              :value="exams"
              removableSort
              tableStyle="min-width: 50rem"
            >
              <template #empty>
                {{
                  $t("messages.no_elements_found", {
                    componentName: $t("component.examPlural"),
                  })
                }}</template
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
              <Column :header="$t('exam.examDate')">
                <template #body="slotProps">
                  <p class="fw-normal mb-1">
                    {{ $filters.datePipe(slotProps.data.examDate) }}
                  </p>
                </template>
              </Column>
            </DataTable>
          </div>
          <p class="fst-italic" style="text-align: right; margin-right: 1em">
            {{ $t("student.examList") }}
          </p>
        </div>
        <div class="card mb-4" v-show="professor.reelectionDate">
          <div class="card-body">
            <DataTable
              :value="professor.subjects"
              removableSort
              tableStyle="min-width: 50rem"
            >
              <template #empty>
                {{
                  $t("messages.no_elements_found", {
                    componentName: $t("component.subjectPlural"),
                  })
                }}</template
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
              <Column :header="$t('subject.literature')">
                <template #body="slotProps">
                  <MDBBtn
                    v-if="!slotProps.data.literature"
                    color="light"
                    @click="openModal(slotProps.data)"
                    >{{ $t("subject.addLiterature") }}</MDBBtn
                  >
                  <p v-else>
                    {{ slotProps.data.literature.split("\\").slice(-1)[0] }}
                  </p>
                </template>
              </Column>
            </DataTable>
          </div>
          <p class="fst-italic" style="text-align: right; margin-right: 1em">
            {{ $t("professor.subjectList") }}
          </p>
        </div>
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
} from "mdb-vue-ui-kit";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { useI18n } from "vue-i18n";

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
    const { t } = useI18n();

    let user = userStore.userLoggedIn;
    let professor = ref({});
    let student = ref({});
    let exams = ref([]);

    let subjectToAddLiterature = ref();
    let literature = ref();

    let isAdmin = ref(true);

    onBeforeMount(() => {
      const roles = userStore.userLoggedIn.authorities;
      if (roles[0].authority === "ROLE_PROFESSOR") {
        loadProfessor()
          .then((res) => {
            professor.value = res.data;
            isAdmin.value = false;
          })
          .catch(() => {});
      } else if (roles[0].authority === "ROLE_STUDENT") {
        loadStudent()
          .then((res) => {
            student.value = res.data;
            isAdmin.value = false;
          })
          .catch(() => {});
        loadStudentsAppliedExams()
          .then((res) => (exams.value = res.data))
          .catch((err) =>
            toast.add({
              severity: "error",
              summary: t("messages.fail_load", {
                componentName: t("components.examPlural"),
              }),
              detail: err,
              life: 2000,
            })
          );
      }
    });

    const loadProfessor = () => {
      return axios.get(`${environment.serverUrl}/professors/${user.username}`);
    };

    const loadStudent = () => {
      return axios.get(`${environment.serverUrl}/students/${user.username}`);
    };

    const loadStudentsAppliedExams = () => {
      return axios.get(
        `${environment.serverUrl}/exams/${userStore.userLoggedIn.username}/applied-exams`
      );
    };

    const viewModal = ref(false);
    const openModal = (subject) => {
      viewModal.value = true;
      subjectToAddLiterature.value = subject;
    };

    const onUploadLiterature = (e) => {
      literature.value = e.target.files[0];
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
      subjectToAddLiterature.value.literature = literature.value.name;
      uploadLiterature()
        .then(() => {
          toast.add({
            severity: "success",
            summary: t("messages.success_add_literature"),
            detail: "",
            life: 2000,
          });
          viewModal.value = false;
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
      viewModal,
      exams,
      openModal,
      literature,
      onUploadLiterature,
      uploadLiteratureToSubject,
    };
  },
};
</script>
