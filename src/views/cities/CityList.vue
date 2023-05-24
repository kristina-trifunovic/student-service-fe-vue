<template>
  <MDBContainer>
    <MDBRow>
      <MDBCol
        ><h1 class="display-6 text-center m-4">
          {{ $t("city.listTitle") }}
        </h1></MDBCol
      >
    </MDBRow>
    <MDBRow class="d-flex justify-content-center">
      <MDBCol md="6">
        <MDBTable class="align-middle mb-0 bg-white col-6">
          <thead class="bg-light">
            <tr>
              <th>{{ $t("city.postalCode") }}</th>
              <th>{{ $t("city.name") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="city in cities" :key="city.postalCode">
              <td>
                <p class="fw-normal mb-1">{{ city.postalCode }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ city.name }}</p>
              </td>
              <td>
                <MDBBtnGroup>
                  <MDBBtn color="light">{{ $t("actions.view") }}</MDBBtn>
                  <MDBBtn color="warning">{{ $t("actions.edit") }}</MDBBtn>
                  <MDBBtn color="danger">{{ $t("actions.delete") }}</MDBBtn>
                </MDBBtnGroup>
              </td>
            </tr>
          </tbody>
        </MDBTable>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>

<script>
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTable,
  MDBBtn,
  MDBBtnGroup,
} from "mdb-vue-ui-kit";
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { environment } from "@/environments/environment";

export default {
  name: "AppCityList",
  components: { MDBContainer, MDBRow, MDBCol, MDBTable, MDBBtn, MDBBtnGroup },
  setup() {
    let cities = ref([]);

    const loadCities = () => {
      return axios.get(`${environment.serverUrl}/cities`);
    };

    onBeforeMount(() => {
      loadCities()
        .then((res) => {
          cities.value = res.data;
        })
        // TODO add a popup
        .catch((err) => console.log("error happened", err));
    });

    return { cities };
  },
};
</script>
