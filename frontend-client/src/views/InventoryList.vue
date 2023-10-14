<template>
  <Toast />
  <div class="card">
    <DataTable
      :loading="loading"
      v-model:selection="selectedInventory"
      v-model:filters="filters"
      filterDisplay="menu"
      :value="inventory"
      dataKey="id"
      @update:selection="clearSelection"
      :metaKeySelection="false"
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
      class="inventory-table">
      <template #header>
        <HeaderPanel
          name="Inventory List"
          :filters="filters"
          :fetchData="fetchData"
          :clearFilter="clearFilter"
          @inputUpdate="filters['global'].value = $event" />
      </template>
      <template #empty v-if="!loading">No items found.</template>
      <Column selectionMode="multiple" />
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
          Reserving <span class="dialog-item-name">{{ selectedInventory[0].name }}</span>
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
            <Image :src="`${selectedInventory[0].img}?height=300`" />
            <div class="dialog-details-inner">
              <p><span class="bold">Description:</span> {{ selectedInventory[0].description }}</p>
              <p><span class="bold">Category:</span> {{ selectedInventory[0].category }}</p>
              <p><span class="bold">Location:</span> {{ selectedInventory[0].location }}</p>
              <p><span class="bold">Start Date:</span> {{ formatDate(selectedInventory[0].startDate) }}</p>
              <p><span class="bold">End Date:</span> {{ formatDate(selectedInventory[0].endDate) }}</p>
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
import InputText from 'primevue/inputtext';
import AutoComplete from 'primevue/autocomplete';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import Image from 'primevue/image';
import Toast from 'primevue/toast';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import ImageColumn from '@/components/inventory-list/ImageColumn.vue';
import HeaderPanel from '@/components/inventory-list/HeaderPanel.vue';
import { useInventoryStore } from '@/store';
// import { isDev } from '@/utils/env';
// import sleep from '@/utils/sleep';

// get the inventory store
const inventoryStore = useInventoryStore();
// const inventoryList = ref([]);
const { inventory } = storeToRefs(inventoryStore);

// initialize the toast notifications
const toast = useToast();
const toastDuration = 5000;

// create the reactive variables
const loading = ref(false);
const selectedInventory = ref();
const statuses = ref([]);
const locations = ref([]);
const categories = ref([]);
const dialogVisible = ref(false);
const dialogPosition = ref('top');
const reservationStartDate = ref();
const reservationEndDate = ref();
const reservationEndDateDisabled = ref(true);

// set the default filter operators and constraints
const filters = ref();

function initFilters() {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: 'available', matchMode: FilterMatchMode.EQUALS }],
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
function setFilterOptions(newInventory) {
  statuses.value = createUniqueFilterOptions(newInventory, 'status');
  locations.value = createUniqueFilterOptions(newInventory, 'location');
  categories.value = createUniqueFilterOptions(newInventory, 'category');
}

// clear the filters
const clearFilter = () => {
  initFilters();
};
onBeforeMount(() => {
  initFilters();
});

// fetch the data from the server or test data file
// and set the reactive variables
async function fetchData() {
  loading.value = true;
  try {
    await inventoryStore.fetchInventory();
    setFilterOptions(inventoryStore.inventory);
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

// submit the selected row
function submitSelection() {
  if (!selectedInventory.value?.length) {
    toast.add({
      severity: 'error',
      summary: 'No items selected',
      detail: 'Please select at least one item to submit',
      life: toastDuration,
    });
    return;
  }
  if (selectedInventory.value.length > 1) {
    toast.add({
      severity: 'warn',
      summary: 'Multiple items selected',
      detail: 'Only one item can be submitted at a time',
      life: toastDuration,
    });
    return;
  }
  if (selectedInventory.value[0].status === 'unavailable') {
    toast.add({
      severity: 'error',
      summary: 'Item is unavailable',
      detail: 'Please select an available item',
      life: toastDuration,
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

// submit the reservation to the server
function submitReservation(closeFn) {
  if (!reservationStartDate.value || !reservationEndDate.value) {
    toast.add({
      severity: 'error',
      summary: 'Invalid date',
      detail: 'Please select a valid date',
      life: toastDuration,
    });
    return;
  }
  if (reservationStartDate.value > reservationEndDate.value) {
    toast.add({
      severity: 'error',
      summary: 'Invalid date range',
      detail: 'Please select a valid date range',
      life: toastDuration,
    });
    return;
  }

  // TODO: submit reservation to server
  toast.add({
    severity: 'success',
    summary: 'Reservation submitted',
    detail: `Your ${selectedInventory.value[0].name} reservation has been submitted for ${formatDate(reservationStartDate.value)} to ${formatDate(reservationEndDate.value)}}`,
    life: toastDuration,
  });
  selectedInventory.value[0].status = 'unavailable';
  selectedInventory.value = [];
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

// fetch data when the view is created
onMounted(async () => {
  await fetchData();
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
  flex-direction: row;
  gap: 1.5rem;
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
