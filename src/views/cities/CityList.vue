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
                  <MDBBtn color="light" @click="openModal(city)">{{
                    $t("actions.view")
                  }}</MDBBtn>
                  <MDBBtn color="warning" @click="router.push({name: 'city-update', params: {id: city.postalCode} })">{{ $t("actions.edit") }}</MDBBtn>
                  <MDBBtn color="danger" @click="onDelete(city)">{{ $t("actions.delete") }}</MDBBtn>
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
  >
  <MDBModalHeader></MDBModalHeader>
    <MDBModalBody>
      <p style="margin-left: 2em;">
        <h1 class="display-6"><small class="text-muted">{{$t('city.postalCode')}}: </small>{{cityToShow.postalCode}}</h1>
        <h1 class="display-6"><small class="text-muted">{{$t('city.name')}}: </small>{{cityToShow.name}}</h1>
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
    <MDBModalBody>{{$t('actions.deleteAction', {name: cityToDelete.name})}}</MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="danger" @click="deleteCity">{{$t('actions.yes')}}</MDBBtn>
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
  name: "AppCityList",
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

    const viewModal = ref(false);
    const cityToShow = ref({});
    const openModal = (city) => {
      cityToShow.value = city;
      viewModal.value = true;
    };

    const router = useRouter();

    const deleteModal = ref(false);
    const cityToDelete = ref({})
    const onDelete = (city) => {
      cityToDelete.value = city;
      deleteModal.value = true;
    }
    const deleteCity = () => {
      axios.delete(`${environment.serverUrl}/cities/${cityToDelete.value.postalCode}`)
        .then(() => {
          const deletedCityIndex = cities.value.findIndex(city => city.postalCode == cityToDelete.value.postalCode)
          cities.value.splice(deletedCityIndex, 1)
          deleteModal.value = false;
        })
        .catch((err) => console.log('error happened', err))
    }

    return { cities, openModal, cityToShow, viewModal, router, onDelete, deleteModal, cityToDelete, deleteCity };
  },
};
</script>
