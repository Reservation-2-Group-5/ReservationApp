<template>
  <Toast />
  <div class="card">
    <DataTable
      :loading="loading"
      v-model:filters="filters"
      filterDisplay="menu"
      :value="reservations"
      dataKey="id"
      paginator
      removableSort
      scrollable
      scrollHeight="flex"
      :rows="10"
      paginatorTemplate="JumpToPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first}-{last} of {totalRecords}"
      :globalFilterFields="['name', 'description', 'category', 'location', 'requestedBy']"
      tableStyle="min-width: 50rem;"
      class="reservations-table">
      <template #header>
        <HeaderPanel
          name="Admin - Pending Reservations"
          :filters="filters"
          :fetchData="requestData"
          :clearFilters="clearFilter"
          @inputUpdate="filters['global'].value = $event" />
      </template>
      <template #empty v-if="!loading">No items found.</template>
      <Column header="Image">
        <template #body="{ data }">
          <ImageColumn :data="data" />
        </template>
      </Column>
      <Column field="name" header="Name" sortable>
        <template #body="{ data }">
          {{ data.name }}
        </template>
        <template #filter="{ filterModel }">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <AutoComplete v-model="filterModel.value" :suggestions="filteredItems" @complete="search" :virtualScrollerOptions="{ itemSize: 38, style: 'overflow-x: hidden' }" dropdown />
          </span>
        </template>
      </Column>
      <Column field="description" header="Description">
        <template #body="{ data }">
          {{ data.description }}
        </template>
        <template #filter="{ filterModel }">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by description" />
          </span>
        </template>
      </Column>
      <Column header="Category" sortable filterField="category" :showFilterMatchModes="false" :showFilterOperator="false" :maxConstraints="1" :filterMenuStyle="{ width: '14rem' }">
        <template #body="{ data }">
          {{ data.category }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="categories" placeholder="Any" class="p-column-filter" />
        </template>
      </Column>
      <Column field="pTag" header="P-Tag" sortable />
      <Column field="location" header="Location" sortable :showFilterMatchModes="false" :showFilterOperator="false" :maxConstraints="1" :filterMenuStyle="{ width: '14rem' }">
        <template #body="{ data }">
          {{ data.location }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="locations" placeholder="Any" class="p-column-filter" />
        </template>
      </Column>
      <Column field="startDate" filterField="startDate" header="Start Date" dataType="date" :showFilterOperator="false" style="min-width: 13rem" sortable>
        <template #body="{ data }">
          {{ formatDate(data.startDate) }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" showTime hourFormat="12" :maxDate="new Date()" showButtonBar selectionMode="single" showIcon :showOnFocus="false" />
        </template>
      </Column>
      <Column field="endDate" filterField="endDate" header="End Date" dataType="date" :showFilterOperator="false" style="min-width: 13rem" sortable>
        <template #body="{ data }">
          {{ formatDate(data.endDate) }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" showTime hourFormat="12" :minDate="new Date('9 October 1963')" showButtonBar selectionMode="single" showIcon :showOnFocus="false" />
        </template>
      </Column>
      <Column header="Requested By" filterField="requestedBy" :showFilterMatchModes="false" :showFilterOperator="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 11rem">
        <template #body="{ data }">
          <ProfileName :name="data.requestedBy" image="https://images.placeholders.dev/?width=32&height=32" />
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="requestees" placeholder="Any" class="p-column-filter">
            <template #option="slotProps">
              <ProfileName :name="slotProps.option" image="https://images.placeholders.dev/?width=32&height=32" />
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column field="requestedDate" filterField="requestedDate" header="Requested On" dataType="date" :showFilterOperator="false" style="min-width: 13rem" sortable>
        <template #body="{ data }">
          {{ formatDate(data.requestedDate) }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" showTime hourFormat="12" :minDate="new Date('9 October 1963')" showButtonBar selectionMode="single" showIcon :showOnFocus="false" />
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <div class="admin-btns">
            <Button
              type="button"
              icon="pi pi-check-square"
              severity="success"
              label="Approve"
              size="small"
              @click="approveReservation(data)" />
            <Button
              type="button"
              icon="pi pi-times"
              severity="danger"
              label="Deny"
              size="small"
              @click="denyReservation(data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import {
  ref,
  onBeforeMount,
  computed,
  onMounted,
} from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import AutoComplete from 'primevue/autocomplete';
import MultiSelect from 'primevue/multiselect';
import Calendar from 'primevue/calendar';
import Toast from 'primevue/toast';
import ImageColumn from '@/components/inventory-list/ImageColumn.vue';
import { useRouter } from 'vue-router';
import { useUserStore, useReservationStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import HeaderPanel from '@/components/inventory-list/HeaderPanel.vue';
import ProfileName from '@/components/inventory-list/ProfileName.vue';
import {
  formatDate,
  initFilters,
  fetchData,
  clearFilters,
  searchItems,
} from '@/utils/inventory';

const userStore = useUserStore();
const reservationStore = useReservationStore();
const { isAdmin } = storeToRefs(userStore);
const { reservations } = storeToRefs(reservationStore);

// initialize the toast notifications
const toast = useToast();
const toastDuration = 5000;

// create the reactive variables
const loading = ref(false);
const statuses = ref([]);
const locations = ref([]);
const categories = ref([]);
const requestees = ref([]);

// set the default filter operators and constraints
const filters = ref();
const clearFilter = () => clearFilters(filters);
const lists = {
  status: statuses,
  location: locations,
  category: categories,
  requestedBy: requestees,
};

// create a list of item names for the autocomplete
const itemNames = computed(() => reservationStore.reservations.map((item) => item.name));
const filteredItems = ref([]);

function search(event) {
  searchItems(event, itemNames, filteredItems);
}

function approveReservation(data) {
  reservationStore.approveReservation(data.id);
  toast.add({
    severity: 'success',
    summary: 'Reservation Approved',
    detail: `${data.name} has been approved.`,
    life: toastDuration,
  });
}

function denyReservation(data) {
  reservationStore.denyReservation(data.id);
  toast.add({
    severity: 'warn',
    summary: 'Reservation Denied',
    detail: `${data.name} has been denied.`,
    life: toastDuration,
  });
}

async function requestData() {
  const fetchFn = reservationStore.fetchReservations;
  await fetchData(fetchFn, reservationStore.reservations, loading, lists);
}

const router = useRouter();

// redirect to home if not admin
onBeforeMount(() => {
  if (!isAdmin.value) {
    router.push('/');
  }
  initFilters(filters);
});
// fetch data when the view is created
onMounted(async () => {
  await requestData();
});
</script>

<style scoped>
.card {
  height: 100%;
}

.reservations-table {
  flex: 1;
}

.admin-btns {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}
</style>
