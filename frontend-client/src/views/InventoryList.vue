<template>
  <div class="card">
    <DataTable
      :loading="loading"
      v-model:selection="selectedInventory"
      v-model:filters="filters"
      filterDisplay="menu"
      :value="inventory"
      @update:selection="clearSelection"
      :metaKeySelection="false"
      paginator
      removableSort
      scrollable
      scrollHeight="flex"
      :rows="25"
      paginatorTemplate="JumpToPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 25, 50]"
      currentPageReportTemplate="Showing {first}-{last} of {totalRecords}"
      :globalFilterFields="['tag', 'category', 'name', 'assignedTo', 'netId', 'location', 'fundingSource', 'department', 'serialNumber', 'poNumber', 'warrantyExpiration', 'available']"
      tableStyle="min-width: 50rem;"
      class="inventory-table">
      <template #header>
        <HeaderPanel
          name="Inventory List"
          :filters="filters"
          :fetchData="requestData"
          :clearFilters="clearFilter"
          @inputUpdate="filters['global'].value = $event" />
      </template>
      <template #empty v-if="!loading">No items found.</template>
      <Column selectionMode="multiple" />
      <Column field="tag" header="Tag #" sortable style="min-width: 6rem" />
      <Column field="category" header="Category" v-bind="filterAttributes">
        <template #body="{ data }">
          {{ data.category }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="categories" placeholder="Any" class="p-column-filter" />
        </template>
      </Column>
      <Column field="name" header="Name" v-bind="filterAttributes" :maxConstraints="2" :showFilterMatchModes="true" filterMenuStyle="width: 16rem">
        <template #body="{ data }">
          {{ data.name }}
        </template>
        <template #filter="{ filterModel }">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <AutoComplete v-model="filterModel.value" :suggestions="filteredItems" @complete="search" :virtualScrollerOptions="{ itemSize: 38, style: 'overflow-x: hidden; width: 13.3rem' }" dropdown />
          </span>
        </template>
      </Column>
      <Column field="assignedTo" header="Assigned To" v-bind="filterAttributes" style="min-width: 11rem">
        <template #body="{ data }">
          <ProfileName
            v-if="data.assignedTo"
            :name="data.assignedTo"
            :image="placeholderAvatar"
            :netId="data.netId" />
          <span v-else>None</span>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="assignees" placeholder="Any" class="p-column-filter">
            <template #option="slotProps">
              <ProfileName :name="slotProps.option" :image="placeholderAvatar" />
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column field="location" header="Location" v-bind="filterAttributes">
        <template #body="{ data }">
          {{ data.location }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="locations" placeholder="Any" class="p-column-filter" />
        </template>
      </Column>
      <Column field="fundingSource" header="Funding Source" v-bind="filterAttributes">
        <template #body="{ data }">
          {{ data.fundingSource }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="fundingSources" placeholder="Any" class="p-column-filter" />
        </template>
      </Column>
      <Column field="department" header="Department Ownership" v-bind="filterAttributes">
        <template #body="{ data }">
          {{ data.department }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="departments" placeholder="Any" class="p-column-filter" />
        </template>
      </Column>
      <Column field="serialNumber" header="Serial #" style="min-width: 7rem" v-bind="filterAttributes" />
      <Column field="poNumber" header="PO#" v-bind="filterAttributes" />
      <Column field="warrantyExpiration" header="Warranty Expiration" dataType="date" v-bind="filterAttributes" :showFilterMatchModes="true" :maxConstraints="2">
        <template #body="{ data }">
          <div v-tooltip.left="formatDate(data.warrantyExpiration, true)">
            {{ formatDate(data.warrantyExpiration) }}
          </div>
        </template>
        <template #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" showButtonBar selectionMode="single" showIcon :showOnFocus="false" />
        </template>
      </Column>
      <Column field="startDate" dataType="date" v-bind="filterAttributes" :showFilterMatchModes="true" :maxConstraints="2">
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Reservation Start Date'">Res Start</span>
        </template>
        <template #body="{ data }">
          <div v-tooltip.left="formatDate(data.startDate, true)">
            {{ (data.startDate) ? formatDate(data.startDate) : 'None' }}
          </div>
        </template>
        <template #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" showButtonBar selectionMode="single" showIcon :showOnFocus="false" />
        </template>
      </Column>
      <Column field="endDate" dataType="date" v-bind="filterAttributes" :showFilterMatchModes="true" :maxConstraints="2">
        <template #header>
          <span class="p-column-title" v-tooltip.top="'Reservation End Date'">Res End</span>
        </template>
        <template #body="{ data }">
          <div v-tooltip.left="formatDate(data.endDate, true)">
            {{ (data.endDate) ? formatDate(data.endDate) : 'None' }}
          </div>
        </template>
        <template #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" showButtonBar selectionMode="single" showIcon :showOnFocus="false" />
        </template>
      </Column>
      <Column field="available" header="Status" v-bind="filterAttributes">
        <template #body="{ data }">
          <Tag
            :value="data.available"
            :severity="getSeverity(data.available)" />
        </template>
        <template #filter="{ filterModel }">
          <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Select One" class="p-column-filter" showClear>
            <template #option="{ option }">
              <Tag :value="option" :severity="getSeverity(option)" />
            </template>
          </Dropdown>
        </template>
      </Column>
      <template #paginatorend>
        <div class="submit-btn">
          <Button type="submit" icon="pi pi-check-square" label="Submit" @click.prevent="submitSelection" />
        </div>
      </template>
    </DataTable>
  </div>
  <Dialog v-model:visible="dialogVisible" :position="dialogPosition" modal header="Header" :style="{ width: '50vw' }">
    <template #container="slotProps">
      <Card class="card">
        <template #title>
          Reserving Item
          <Divider />
        </template>
        <template #content>
          <div class="dialog-date-selections">
            <span class="p-float-label">
              <Calendar v-model="reservationStartDate" inputId="reservation-start-date" dateFormat="mm/dd/yy" showTime hourFormat="12" :minDate="minStartDate" showButtonBar selectionMode="single" showIcon hideOnDateTimeSelect />
              <label for="reservation-start-date">Reservation Start Date</label>
            </span>
            <span class="p-float-label">
              <Calendar v-model="reservationEndDate" inputId="reservation-end-date" dateFormat="mm/dd/yy" showTime hourFormat="12" :minDate="minEndDate" showButtonBar selectionMode="single" showIcon :disabled="reservationEndDateDisabled" hideOnDateTimeSelect />
              <label for="reservation-end-date">Reservation End Date</label>
            </span>
          </div>
          <div class="dialog-details">
            <h1>{{ selectedInventory[0].name }}</h1>
            <div class="dialog-details-inner">
              <p><span class="bold">Category:</span> {{ selectedInventory[0].category }}</p>
              <p><span class="bold">Assigned To:</span> {{ formatAssignedTo(selectedInventory[0].assignedTo, selectedInventory[0].netId) }}</p>
              <p><span class="bold">Location:</span> {{ selectedInventory[0].location }}</p>
              <p><span class="bold">Funding Source:</span> {{ selectedInventory[0].fundingSource }}</p>
              <p><span class="bold">Department Ownership:</span> {{ selectedInventory[0].department }}</p>
              <p><span class="bold">Serial #:</span> {{ selectedInventory[0].serialNumber }}</p>
              <p><span class="bold">PO #:</span> {{ selectedInventory[0].poNumber }}</p>
              <p><span class="bold">Warranty Expiration:</span> {{ formatDate(selectedInventory[0].warrantyExpiration) }}</p>
            </div>
          </div>
          <div class="dialog-buttons">
            <Button icon="pi pi-times" label="Cancel" @click="closeDialog(slotProps.onClose)" />
            <Button icon="pi pi-check" label="Confirm" @click="submitReservation(slotProps.onClose)" />
          </div>
        </template>
      </Card>
    </template>
  </Dialog>
</template>

<script setup>
import {
  onMounted,
  ref,
  computed,
  onBeforeMount,
  watch,
} from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import MultiSelect from 'primevue/multiselect';
import AutoComplete from 'primevue/autocomplete';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import toast from '@/utils/toastWrapper';
import { storeToRefs } from 'pinia';
import HeaderPanel from '@/components/inventory-list/HeaderPanel.vue';
import ProfileName from '@/components/inventory-list/ProfileName.vue';
import { useInventoryStore, useDeviceReservationStore, useUserStore } from '@/store';
import {
  formatDate,
  initFilters,
  fetchData,
  clearFilters,
  searchItems,
} from '@/utils/dataTableFilters';

const placeholderAvatar = 'https://images.placeholders.dev/?width=32&height=32';

// get the stores
const inventoryStore = useInventoryStore();
const { inventory } = storeToRefs(inventoryStore);
const deviceReservationStore = useDeviceReservationStore();
const userStore = useUserStore();

// create the reactive variables
const loading = ref(false);
const selectedInventory = ref();
const statuses = ref([]);
const locations = ref([]);
const categories = ref([]);
const assignees = ref([]);
const fundingSources = ref([]);
const departments = ref([]);

const dialogVisible = ref(false);
const dialogPosition = ref('center');
const reservationStartDate = ref();
const reservationEndDate = ref();
const reservationEndDateDisabled = ref(true);

// set the default filter operators and constraints
const filters = ref();
const lists = {
  available: statuses,
  location: locations,
  category: categories,
  assignedTo: assignees,
  fundingSource: fundingSources,
  department: departments,
};

// set the default column filter attributes to bind
const filterAttributes = {
  sortable: true,
  showFilterMatchModes: false,
  showFilterOperator: false,
  maxConstraints: 1,
  filterMenuStyle: {
    width: '14rem',
  },
};

// clear the filters
const clearFilter = () => {
  clearFilters(filters);
  filters.value.available.constraints[0].value = 'available';
};
onBeforeMount(() => {
  initFilters(filters);
  filters.value.available.constraints[0].value = 'available';
});

// set the color of the status tag
function getSeverity(status) {
  switch (status) {
    case 'available':
      return 'success';
    case 'unavailable':
      return 'danger';
    case 'pending':
      return 'warning';
    default:
      return 'info';
  }
}

// clear the selection when the user clicks the select all button
// or set the selection to the last item selected when the user clicks a different item
function clearSelection(event) {
  // when the user selects a different item, the event is an array of length 2
  // the first item is the previous selection and the second item is the current selection
  const currentSelection = (event.length && event.length <= 2) ? event[event.length - 1] : null;
  selectedInventory.value = (currentSelection) ? [currentSelection] : [];
}

// create a list of item names for the autocomplete
const itemNames = computed(() => inventoryStore.inventory.map((item) => item.name));
const filteredItems = ref([]);

function search(event) {
  searchItems(event, itemNames, filteredItems);
}

// submit the selected row
function submitSelection() {
  if (!selectedInventory.value?.length) {
    // toast.info(CustomToast, 'Select an item to submit');
    toast.info({
      title: 'No items selected',
      content: 'Please select at least one item to submit',
    });
    return;
  }
  if (selectedInventory.value.length > 1) {
    toast.info({
      title: 'Multiple items selected',
      content: 'Only one item can be submitted at a time',
    });
    return;
  }

  // don't allow the user to submit request for an unavailable item
  if (selectedInventory.value[0].available.match(/(unavailable|pending)/)) {
    toast.info({
      title: 'Item is unavailable',
      content: 'Please select an available item',
    });
    return;
  }

  if (!userStore.isLoggedIn) {
    toast.info({
      title: 'Not logged in',
      content: 'Please log in to submit a reservation',
    });
    return;
  }

  console.log('selectedInventory', selectedInventory.value[0]);
  // open the dialog to set the reservation dates
  dialogVisible.value = true;
}

// close the dialog box
function closeDialog(closeFn) {
  dialogVisible.value = false;
  reservationStartDate.value = null;
  reservationEndDate.value = null;
  closeFn();
}

function formatAssignedTo(name, netId) {
  const nameStr = name ?? 'None';
  return (netId) ? `${nameStr} (${netId})` : nameStr;
}

// submit the reservation to the server
async function submitReservation(closeFn) {
  if (!reservationStartDate.value || !reservationEndDate.value) {
    toast.error({
      title: 'Invalid date',
      content: 'Please select a start and end date',
    });
    return;
  }
  if (reservationStartDate.value > reservationEndDate.value) {
    toast.error({
      title: 'Invalid date range',
      content: 'Start date must be before end date',
    });
    return;
  }
  if (!userStore.isLoggedIn) {
    toast.info({
      title: 'Not logged in',
      content: 'Please log in to submit a reservation',
    });
    closeDialog(closeFn);
    return;
  }

  try {
    await deviceReservationStore.createReservation({
      tag: selectedInventory.value[0].tag,
      reqNetId: userStore.user.netId,
      requestedStartDate: reservationStartDate.value,
      requestedEndDate: reservationEndDate.value,
    });
    toast.success({
      title: 'Reservation request submitted!',
      content: `Your ${selectedInventory.value[0].name} reservation has been submitted for ${formatDate(reservationStartDate.value)} to ${formatDate(reservationEndDate.value)}`,
    });
    selectedInventory.value[0].available = 'unavailable';
    selectedInventory.value = [];
  } catch (err) {
    toast.error({
      title: 'Error submitting reservation',
      content: err.message,
    });
    console.error(err);
  }
  closeDialog(closeFn);
}

// round minutes of date to the nearest hour
function roundMinutes(date) {
  date.setHours(date.getHours() + Math.ceil(date.getMinutes() / 60));
  date.setMinutes(0, 0, 0); // Resets seconds and milliseconds to 0
  return date;
}

// set the min start date to the current date rounded to the nearest hour
const minStartDate = ref(roundMinutes(new Date()));
minStartDate.value = roundMinutes(minStartDate.value);

// set the default min end date to the min start date + 31 days
const minEndDate = ref(new Date());
minEndDate.value.setDate(minStartDate.value.getDate() + 31);
minEndDate.value = roundMinutes(minEndDate.value);

// disable the end date input until the start date is selected
// and set the min end date to the selected start date + 1 day
watch(reservationStartDate, (newVal) => {
  if (newVal && newVal instanceof Date) {
    reservationEndDateDisabled.value = false;
    minEndDate.value = new Date(newVal);
    minEndDate.value.setDate(minEndDate.value.getDate() + 1);
    minEndDate.value = roundMinutes(minEndDate.value);
  } else {
    reservationEndDateDisabled.value = true;
  }
});

async function requestData() {
  await fetchData(inventoryStore, loading, lists);
}

// fetch data when the view is created
onMounted(async () => {
  await requestData();
  console.log('inventory', inventory.value);
});
</script>

<style scoped>
.card {
  height: 100%;
}

.inventory-table {
  flex: 1;
}

.submit-btn {
  display: flex;
  justify-content: center;
}

:deep([data-pc-section="headercheckboxwrapper"]) {
  display: none;
}

:deep(.p-paginator-right-content) {
  margin-left: 20px;
}

:deep(.p-card-content) {
  padding: 0;
}

:deep(.p-paginator-bottom) {
  border-top: 3px solid var(--surface-d);
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 1rem;
}

.dialog-item-name {
  font-style: italic;
  font-weight: 400;
  background-color: #111111ff;
  padding: 0.1rem 0.5rem;
  border-radius: 0.5rem;
}

.dialog-date-selections {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  padding: 0.5rem 0 1.5rem 0;
}

.dialog-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dialog-details h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
}

:deep(.dialog-details img) {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.dialog-details-inner {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--surface-d);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.dialog-details-inner p {
  margin-top: 0;
}

.bold {
  font-weight: 600;
}
</style>
