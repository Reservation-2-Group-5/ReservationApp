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
      :globalFilterFields="['name', 'description', 'category', 'location', 'status']"
      tableStyle="min-width: 50rem;"
      class="reservations-table">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">Pending Reservations</span>
          <div class="right-header-buttons">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter" />
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </span>
            <Button icon="pi pi-refresh" raised @click="fetchData" severity="secondary" />
          </div>
        </div>
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
            <AutoComplete v-model="filterModel.value" :suggestions="filteredItems" @complete="searchItems" :virtualScrollerOptions="{ itemSize: 38, style: 'overflow-x: hidden' }" dropdown />
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
      <Column field="status" header="Status" :showFilterMatchModes="false" :showFilterOperator="false" :maxConstraints="1">
        <template #body="{ data }">
          <Tag
            :value="data.status"
            :severity="getSeverity(data.status)" />
        </template>
        <template #filter="{ filterModel }">
          <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Select One" class="p-column-filter" showClear>
            <template #option="{ option }">
              <Tag :value="option" :severity="getSeverity(option)" />
            </template>
          </Dropdown>
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
import Dropdown from 'primevue/dropdown';
import Toast from 'primevue/toast';
import Tag from 'primevue/tag';
import ImageColumn from '@/components/inventory-list/ImageColumn.vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useRouter } from 'vue-router';
import { useUserStore, useReservationStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';

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

// set the default filter operators and constraints
const filters = ref();

function initFilters() {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    location: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    startDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }],
    },
    endDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_BEFORE }],
    },
    category: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
    },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    description: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
  };
}

// create a list of unique filter options
function createUniqueFilterOptions(data, field) {
  return [...new Set(data.map((item) => item[field]))];
}

// set the filter options for the dropdowns
function setFilterOptions(newReservations) {
  statuses.value = createUniqueFilterOptions(newReservations, 'status');
  locations.value = createUniqueFilterOptions(newReservations, 'location');
  categories.value = createUniqueFilterOptions(newReservations, 'category');
}

// clear the filters
const clearFilter = () => {
  initFilters();
};

// fetch the data from the server or test data file
// and set the reactive variables
async function fetchData() {
  loading.value = true;
  try {
    await reservationStore.fetchReservations();
    setFilterOptions(reservationStore.reservations);
  } catch (err) {
    console.error(err);
  }
  loading.value = false;
}

// format the date to a readable format
function formatDate(date) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}

// set the color of the status tag
function getSeverity(status) {
  if (status === 'unavailable') {
    return 'danger';
  }
  return 'success';
}

// create a list of item names for the autocomplete
const itemNames = computed(() => reservationStore.reservations.map((item) => item.name));
const filteredItems = ref([]);

const searchItems = (event) => {
  // in final app, make request to db with query and return filtered results
  // for testing filter at client side
  const { query } = event;
  const filteredItemsList = [];

  for (let i = 0; i < itemNames.value.length; i += 1) {
    const item = itemNames.value[i];

    if (item.toLowerCase().indexOf(query.toLowerCase()) === 0) {
      filteredItemsList.push(item);
    }
  }

  filteredItems.value = filteredItemsList;
};

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

const router = useRouter();

// redirect to home if not admin
onBeforeMount(() => {
  if (!isAdmin.value) {
    router.push('/');
  }
  initFilters();
});
// fetch data when the view is created
onMounted(async () => {
  await fetchData();
});
</script>

<style scoped>
.card {
  height: 100%;
}

.reservations-table {
  flex: 1;
}

.right-header-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-btns {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}
</style>
