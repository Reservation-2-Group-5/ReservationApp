<template>
  <main>
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
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first}-{last} of {totalRecords}"
        :globalFilterFields="['name', 'description', 'category', 'location', 'status']"
        tableStyle="min-width: 50rem;"
        class="inventory-table">
        <template #header>
          <div class="flex flex-wrap align-items-center justify-content-between gap-2">
            <span class="text-xl text-900 font-bold">Inventory</span>
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
        <template #empty>No items found.</template>
        <Column selectionMode="multiple" />
        <Column header="Image">
          <template #body="{ data }">
            <ImageColumn :img="data.image" />
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
        <Column field="date" filterField="date" header="Date" dataType="date" :showFilterOperator="false" style="min-width: 13rem" sortable>
          <template #body="{ data }">
            {{ formatDate(data.date) }}
          </template>
          <template #filter="{ filterModel }">
            <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" showTime hourFormat="12" :maxDate="new Date()" :minDate="new Date('9 October 1963')" showButtonBar selectionMode="single" showIcon :showOnFocus="false" />
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
        <template #footer>
          <div class="submit-btn">
            <Button type="submit" icon="pi pi-check-square" label="Submit" @click.prevent="submitSelection" />
          </div>
        </template>
      </DataTable>
    </div>
  </main>
</template>

<script setup>
import {
  onMounted,
  ref,
  computed,
  onBeforeMount,
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
import Toast from 'primevue/toast';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import ImageColumn from '@/components/inventory-list/ImageColumn.vue';
import { isDev } from '@/utils/env';
import sleep from '@/utils/sleep';

const toast = useToast();

// create the reactive variables
const inventory = ref([]);
const loading = ref(false);
const selectedInventory = ref();
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
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }],
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
function setFilters(newInventory) {
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
async function fetchData(location) {
  inventory.value = [];
  loading.value = true;
  if (isDev) {
    // simulate a fetch delay
    await sleep(1000);
  }
  try {
    const response = await fetch(location);
    const json = await response.json();
    for (const item of json) {
      item.date = new Date(item.date);
    }
    inventory.value = json;
    loading.value = false;
    setFilters(json);
  } catch (err) {
    console.error(err);
  }
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
const itemNames = computed(() => inventory.value.map((item) => item.name));
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

// submit the selected items to the server
const toastDuration = 5000;

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
  console.log('Submitting', selectedInventory.value[0]);
  toast.add({
    severity: 'success',
    summary: 'Item submitted',
    detail: `${selectedInventory.value[0].name} has been submitted`,
    life: toastDuration,
  });
}

// fetch data when the view is created
onMounted(async () => {
  const location = (isDev) ? 'testData.json' : 'db';
  await fetchData(location);
});
</script>

<style scoped>
main {
  flex: 1;
}

main .card {
  flex: 1;
  display: flex;
}

.inventory-table {
  flex: 1;
}

.right-header-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.submit-btn {
  display: flex;
  justify-content: center;
}

:deep([data-pc-section="headercheckboxwrapper"]) {
  display: none;
}
</style>
