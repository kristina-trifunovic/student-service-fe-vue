<template>
  <div class="container">
    <div class="row lg-6 md-6 align-items-center justify-content-center">
      <div class="col-lg-8 col-md-8 col-12">
        <h1 class="display-6 text-center m-4">
          {{
            mode == "update"
              ? $t("subject.updateTitle")
              : $t("subject.addTitle")
          }}
        </h1>
      </div>
    </div>
    <div class="row lg-4 md-4 align-items-center justify-content-center">
      <div class="col-lg-4 col-md-4 col-12">
        <vee-form
          class="align-items-center"
          :validation-schema="schema"
          @submit="addOrUpdateSubject"
        >
          <!-- ID input -->
          <!-- <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="id"
              type="text"
              :placeholder="$t('subject.id')"
              v-model="subject.id"
              :disabled="mode == 'update'"
            />
            <ErrorMessage name="id" class="mb-3 text-danger" />
          </div> -->
          <!-- Name input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="name"
              type="text"
              :placeholder="$t('subject.name')"
              v-model="subject.name"
            />
            <ErrorMessage name="name" class="mb-3 text-danger" />
          </div>

            <!-- No Of ESP input -->
            <div class="d-flex flex-column col-12">
              <vee-field
                class="form-control mb-2"
                name="noOfEsp"
                type="number"
                :placeholder="$t('subject.noOfEsp')"
                v-model="subject.noOfEsp"
              />
              <ErrorMessage name="noOfEsp" class="mb-3 text-danger" />
            </div>
          </div>
          <!-- Year Of Study input -->
          <div class="d-flex flex-column col-12">
            <vee-field
              class="form-control mb-2"
              name="yearOfStudy"
              type="number"
              :placeholder="$t('subject.yearOfStudy')"
              v-model="subject.yearOfStudy"
            />
          </div>
          <ErrorMessage name="yearOfStudy" class="mb-3 text-danger" />
          <!-- Semester input -->
          <vee-field
            class="form-control mb-2"
            name="semester"
            as="select"
            v-model="subject.semester"
            :placeholder="$t('subject.semester')"
          >
            <option value="" disabled>
              {{ $t("subject.selectSemester") }}
            </option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </vee-field>
          <ErrorMessage name="semester" class="mb-3 text-danger" />
          <!-- Description input -->
          <div class="d-flex flex-column col-12">
            <vee-field name="description" v-slot="{ description }">
              <textarea
                class="form-control mb-2"
                v-bind="description"
                id="description"
                cols="30"
                rows="2"
                :placeholder="$t('subject.description')"
                v-model="subject.description"
              />
            </vee-field>
            <ErrorMessage name="description" class="mb-3 text-danger" />
          </div>
          <!-- Submit button -->
          <MDBBtnGroup class="d-flex justify-content-center">
            <MDBBtn color="outline" type="submit">{{
              $t("actions.save")
            }}</MDBBtn>
            <MDBBtn color="warning" @click="redirect">{{
              $t("actions.cancel")
            }}</MDBBtn>
          </MDBBtnGroup>
        </vee-form>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { MDBBtnGroup, MDBBtn } from "mdb-vue-ui-kit";
import { environment } from "@/environments/environment";
import axios from "axios";

export default {
  name: "AppSubjectForm",
  components: { MDBBtnGroup, MDBBtn },
  setup() {
    const route = useRoute();
    const router = useRouter();

    let mode = ref("");
    onMounted(() => {
      if (route.params.id) {
        subject.value = route.meta.subject["data"];
        mode.value = "update";
      } else mode.value = "add";
    });

    let subject = ref({});

    const schema = {
      name: "required|min:3|max:30",
      description: "max:200",
      noOfEsp: "required|max_value:9",
      yearOfStudy: "required|max_value:9",
      semester: "required",
    };

    const addOrUpdateSubject = () => {
      subject.value.id = Math.floor(Math.random() * 1000);
      if (mode.value == "add") {
        addSubject(subject.value)
          .then(() => redirect())
          .catch((err) => console.log("error happened", err));
      } else if (mode.value == "update") {
        updateSubject(subject.value)
          .then(() => redirect())
          // TODO add a popup
          .catch((err) => console.log("error happened", err));
      }
    };

    const addSubject = (subject) => {
      return axios.post(`${environment.serverUrl}/subjects`, subject);
    };
    const updateSubject = (subject) => {
      return axios.put(`${environment.serverUrl}/subjects`, subject);
    };

    const redirect = () => {
      router.push({ name: "subject-list" });
    };

    return {
      subject,
      schema,
      addOrUpdateSubject,
      redirect,
      mode,
    };
  },
};
</script>

<style></style>
