<template>
  <Toast />
  <MDBContainer>
    <MDBRow>
      <MDBCol
        ><h1 class="display-6 text-center m-4">
          {{ $t("city.listTitle") }}
        </h1></MDBCol
      >
    </MDBRow>
    <MDBRow class="d-flex justify-content-center">
      <MDBCol md="8">
        <DataTable :value="cities" removableSort tableStyle="min-width: 50rem">
          <template #empty> {{$t("messages.no_elements_found", {componentName: $t('component.cityPlural')}) }}</template>
            <Column field="postalCode" sortable :header="$t('city.postalCode')"></Column>
            <Column field="name" sortable :header="$t('city.name')"></Column>
            <Column>
              <template #body="slotProps">
                <MDBBtnGroup>
                  <MDBBtn color="light" @click="openModal(slotProps.data)">{{
                    $t("actions.view")
                  }}</MDBBtn>
                  <MDBBtn color="warning" @click="router.push({name: 'city-update', params: {id: slotProps.data.postalCode} })">{{ $t("actions.edit") }}</MDBBtn>
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
  MDBBtn,
  MDBBtnGroup,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-vue-ui-kit";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import { ref, onMounted } from "vue";
import axios from "axios";
import { environment } from "@/environments/environment";
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import Toast from 'primevue/toast';

export default {
  name: "AppCityList",
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
    const cities = ref([]);
    const pageInfo = ref({pageNo: 0, pageSize: 5, totalItems: 10, sortBy: 'postalCode', sortOrder:'asc'});
    const offset = ref(0);
    const pageOptions = [2, 3, 5, 10];

    const toast = useToast();
    const { t } = useI18n();

    const loadCities = (pageInfo) => {
      const params = new URLSearchParams();
      params.append('pageNo', pageInfo.pageNo);
      params.append('pageSize', pageInfo.pageSize);
      params.append('sortBy', pageInfo.sortBy);
      params.append('sortOrder', pageInfo.sortOrder);
      axios.get(`${environment.serverUrl}/cities/page`, {params: params})
        .then((res) => {
          cities.value = res.data.content;
          pageInfo.totalItems = res.data.totalElements;
          pageInfo.pageSize = res.data.size;
          pageInfo.pageNo = res.data.number;
          toast.add({
              severity: "success",
              summary: t("messages.success_load", {
                componentName: t("component.cityPlural"),
              }),
              detail: "",
              life: 2000
            });
        })
        .catch((err) => toast.add({
              severity: "error",
              summary: t("messages.fail_load", {
                componentName: t("component.cityPlural"),
              }),
              detail: err,
              life: 2000
            })
          )
    };

    onMounted(() => {
      loadCities(pageInfo.value)
    });

    const onPageChange = (page) => {
      offset.value = page.rows * page.page;
      pageInfo.value.pageSize = page.rows
      pageInfo.value.pageNo = page.page
      loadCities(pageInfo.value)
    }

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
          toast.add({
              severity: "success",
              summary: t("messages.success_delete", {
                componentName: t("component.city"),
              }),
              detail: "",
              life: 2000
            })
        })
        .catch((err) => toast.add({
              severity: "error",
              summary: t("messages.fail_delete", {
                componentName: t("component.city"),
              }),
              detail: err,
              life: 2000
            }))
    }

    return { cities, openModal, cityToShow, viewModal, router, onDelete, deleteModal, cityToDelete, deleteCity, pageOptions, pageInfo, onPageChange, offset };
  },
};
</script>
