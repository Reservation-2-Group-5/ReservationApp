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
      scrollable
      scrollHeight="flex"
      :rows="10"
      paginatorTemplate="JumpToPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first}-{last} of {totalRecords}"
      :globalFilterFields="['name', 'category', 'location', 'requestedBy']"
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
      <Column expander style="width: 3rem" />
      <Column field="tag" header="Tag #" sortable style="min-width: 6rem" />
      <Column header="Category" sortable filterField="category" :showFilterMatchModes="false" :showFilterOperator="false" :maxConstraints="1" :filterMenuStyle="{ width: '14rem' }">
        <template #body="{ data }">
          {{ data.category }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="categories" placeholder="Any" class="p-column-filter" />
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
      <Column header="Assigned To" filterField="assignedTo" :showFilterMatchModes="false" :showFilterOperator="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 11rem" sortable :maxConstraints="1">
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
      <Column field="location" sortable :showFilterMatchModes="false" :showFilterOperator="false" :maxConstraints="1" :filterMenuStyle="{ width: '14rem' }">
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
      <Column field="fundingSource" sortable>
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Funding Source'">Fund Src</span>
        </template>
      </Column>
      <Column field="department" sortable>
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Department Ownership'">Dept.</span>
        </template>
      </Column>
      <Column field="serialNumber" header="Serial #" sortable style="min-width: 7rem" />
      <Column field="poNumber" header="PO #" sortable />
      <Column field="warrantyExpiration" filterField="warrantyExpiration" dataType="date" :showFilterOperator="false" sortable style="min-width: 10rem">
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
      <template #expansion="slotProps">
        <h3>Reservation Requests</h3>
        <DataTable :value="slotProps.data.reservationRequests" style="width: fit-content;" dataKey="id">
          <Column field="requestedBy" header="Requested By">
            <template #body="{ data }">
              <ProfileName
                :name="data.requestedBy"
                :image="placeholderAvatar"
                :netId="data.netId" />
            </template>
          </Column>
          <Column field="requestedDate" dataType="date" style="min-width: 7.6rem" header="Requested On">
            <template #body="{ data }">
              {{ formatDate(data.requestedDate) }}
            </template>
          </Column>
          <Column field="requestedStartDate" dataType="date" style="min-width: 7.6rem">
            <template #header>
              <span class="p-column-title" v-tooltip.top="'Requested Reservation Starting Date'">Reservation Start</span>
            </template>
            <template #body="{ data }">
              {{ formatDate(data.requestedDate) }}
            </template>
          </Column>
          <Column field="requestedEndDate" dataType="date" style="min-width: 7.6rem">
            <template #header>
              <span class="p-column-title" v-tooltip.top="'Requested Reservation Ending Date'">Reservation End</span>
            </template>
            <template #body="{ data }">
              {{ formatDate(data.requestedDate) }}
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
                  @click="approveRequest(data, slotProps.data)" />
                <Button
                  type="button"
                  icon="pi pi-times"
                  severity="danger"
                  label="Deny"
                  size="small"
                  @click="denyRequest(data, slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
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
} from '@/utils/inventory';
import sleep from '@/utils/sleep';

const placeholderAvatar = 'https://images.placeholders.dev/?width=32&height=32';

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

async function checkIfItemRemoved(itemData) {
  await sleep(1000);
  const filteredReservations = reservations.value.filter((item) => item.tag === itemData.tag);

  const msg = `${itemData.name} has no more reservation requests.`;
  // check if toast already exists
  const existingToast = toastRef.value.messages.some((m) => m.detail === msg);
  if (existingToast) return;

  if (filteredReservations.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Item removed from list',
      detail: msg,
      life: toastDuration,
    });
  }
}

function approveRequest(reservation, itemData) {
  reservationStore.approveRequest(reservation.id);
  toast.add({
    severity: 'success',
    summary: 'Reservation Approved',
    detail: `${reservation.requestedBy}'s ${itemData.name} request has been approved.`,
    life: toastDuration,
  });
  checkIfItemRemoved(itemData);
}

function denyRequest(reservation, itemData) {
  reservationStore.denyRequest(reservation.id);
  toast.add({
    severity: 'warn',
    summary: 'Reservation Denied',
    detail: `${reservation.requestedBy}'s ${itemData.name} request has been denied.`,
    life: toastDuration,
  });
}

async function requestData() {
  await fetchData(reservationStore, loading, lists);
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
  width: 100%;
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

.admin-btns button {
  width: unset;
  padding: 0rem 0.25rem;
}

:deep(.p-paginator-bottom) {
  border-top: 3px solid var(--surface-d);
}
</style>
