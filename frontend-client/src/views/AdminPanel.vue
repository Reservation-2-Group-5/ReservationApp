<template>
  <Toast ref="toastRef" />
  <div class="card">
    <DataTable
      :loading="loading"
      v-model:filters="filters"
      v-model:expandedRows="expandedRows"
      filterDisplay="menu"
      :value="reservations"
      dataKey="tag"
      paginator
      removableSort
      sortField="requestedDate"
      :sortOrder="1"
      scrollable
      scrollHeight="flex"
      :rows="10"
      paginatorTemplate="JumpToPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 25, 50]"
      currentPageReportTemplate="Showing {first}-{last} of {totalRecords}"
      :globalFilterFields="['tag', 'category', 'name', 'assignedTo', 'location', 'fundingSource', 'department', 'serialNumber', 'poNumber', 'warrantyExpiration', 'requestedBy', 'requestedDate', 'requestedStartDate', 'requestedEndDate']"
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
      <Column field="tag" header="Tag #" sortable style="min-width: 6rem" />
      <Column field="category" sortable filterField="category" :showFilterMatchModes="false" :showFilterOperator="false" :maxConstraints="1" :filterMenuStyle="{ width: '14rem' }" style="min-width: 7rem">
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Category'">Cat</span>
        </template>
        <template #body="{ data }">
          {{ data.category }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="categories" placeholder="Any" class="p-column-filter" />
        </template>
      </Column>
      <Column field="name" header="Name" sortable style="min-width: 8rem">
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
      <Column field="assignedTo" filterField="assignedTo" :showFilterMatchModes="false" :showFilterOperator="false" :filterMenuStyle="{ width: '14rem' }" sortable :maxConstraints="1" style="min-width: 9.2rem">
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Assigned To'">Asgn To</span>
        </template>
        <template #body="{ data }">
          <ProfileName :name="data.assignedTo" :image="placeholderAvatar" :netId="data.netId" />
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="assignees" placeholder="Any" class="p-column-filter">
            <template #option="slotProps">
              <ProfileName :name="slotProps.option" :image="placeholderAvatar" />
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column field="location" sortable :showFilterMatchModes="false" :showFilterOperator="false" :maxConstraints="1" :filterMenuStyle="{ width: '14rem' }" style="min-width: 7rem">
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Location'">Loc</span>
        </template>
        <template #body="{ data }">
          {{ data.location }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="locations" placeholder="Any" class="p-column-filter" />
        </template>
      </Column>
      <Column field="fundingSource" sortable style="min-width: 8rem">
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Funding Source'">Fund Src</span>
        </template>
      </Column>
      <Column field="department" sortable style="min-width: 8rem">
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Department Ownership'">Dept</span>
        </template>
      </Column>
      <Column field="serialNumber" header="Serial #" sortable style="min-width: 7rem" />
      <Column field="poNumber" header="PO #" sortable style="min-width: 7rem" />
      <Column field="warrantyExpiration" filterField="warrantyExpiration" dataType="date" :showFilterOperator="false" sortable style="min-width: 7rem">
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Warranty Expiration'">Wrty Exp</span>
        </template>
        <template #body="{ data }">
          {{ formatDate(data.warrantyExpiration) }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" showButtonBar selectionMode="single" showIcon :showOnFocus="false" />
        </template>
      </Column>
      <Column field="requestedBy" style="min-width: 9.2rem" sortable>
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Requested By'">Req By</span>
        </template>
        <template #body="{ data }">
          <ProfileName
            :name="data.requestedBy"
            :image="placeholderAvatar"
            :netId="data.netId" />
        </template>
      </Column>
      <Column field="requestedDate" dataType="date" style="min-width: 6rem" sortable>
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Requested On'">Req On</span>
        </template>
        <template #body="{ data }">
          {{ formatDate(data.requestedDate) }}
        </template>
      </Column>
      <Column field="requestedStartDate" dataType="date" style="min-width: 6rem" sortable>
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Requested Reservation Starting Date'">Res Start</span>
        </template>
        <template #body="{ data }">
          {{ formatDate(data.requestedDate) }}
        </template>
      </Column>
      <Column field="requestedEndDate" dataType="date" style="min-width: 6rem" sortable>
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Requested Reservation Ending Date'">Res End</span>
        </template>
        <template #body="{ data }">
          {{ formatDate(data.requestedDate) }}
        </template>
      </Column>
      <Column>
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Actions'">Act</span>
        </template>
        <template #body="{ data }">
          <div class="admin-btns">
            <Button
              v-tooltip.left="{ value: 'Accept Request', class: 'custom-success', autoHide: false }"
              type="button"
              icon="pi pi-check-square"
              severity="success"
              label=""
              size="small"
              @click="approveRequest(data)" />
            <Button
              v-tooltip.left="{ value: 'Deny Request', class: 'custom-error' }"
              type="button"
              icon="pi pi-times"
              severity="danger"
              label=""
              size="small"
              @click="denyRequest(data)" />
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
import AutoComplete from 'primevue/autocomplete';
import MultiSelect from 'primevue/multiselect';
import Calendar from 'primevue/calendar';
import Toast from 'primevue/toast';
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
} from '@/utils/dataTableFilters';

const placeholderAvatar = 'https://images.placeholders.dev/?width=48&height=48';

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
const assignees = ref([]);
const requestees = ref([]);
const expandedRows = ref([]);
const toastRef = ref();

// set the default filter operators and constraints
const filters = ref();
const clearFilter = () => clearFilters(filters);
const lists = {
  status: statuses,
  location: locations,
  category: categories,
  assignedTo: assignees,
  requestedBy: requestees,
};

// create a list of item names for the autocomplete
const itemNames = computed(() => reservationStore.reservations.map((item) => item.name));
const filteredItems = ref([]);

function search(event) {
  searchItems(event, itemNames, filteredItems);
}

function approveRequest(reservation) {
  reservationStore.approveRequest(reservation.id);
  toast.add({
    severity: 'success',
    summary: 'Reservation Approved',
    detail: `${reservation.requestedBy}'s ${reservation.name} request has been approved.`,
    life: toastDuration,
  });
}

function denyRequest(reservation) {
  reservationStore.denyRequest(reservation.id);
  toast.add({
    severity: 'warn',
    summary: 'Reservation Denied',
    detail: `${reservation.requestedBy}'s ${reservation.name} request has been denied.`,
    life: toastDuration,
  });
}

async function requestData() {
  await fetchData(reservationStore, loading, lists);
}

const router = useRouter();

// redirect to home if not admin
// should have already been checked by the router, but just in case
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
  width: 100%;
}

.reservations-table {
  flex: 1;
}

.admin-btns {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.admin-btns button {
  width: unset;
  padding: 0rem 0.25rem;
}

:deep(.p-paginator-bottom) {
  border-top: 3px solid var(--surface-d);
}
</style>
