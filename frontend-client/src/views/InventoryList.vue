<template>
  <main>
    <div class="card">
      <DataTable
        :loading="loading"
        v-model:selection="selectedInventory"
        v-model:filters="filters"
        filterDisplay="row"
        :value="inventory"
        dataKey="id"
        @update:selection="clearSelection"
        :metaKeySelection="false"
        paginator
        removableSort
        scrollable
        scrollHeight="flex"
        :rows="5"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
        :globalFilterFields="['status']"
        tableStyle="min-width: 50rem;"
        class="inventory-table">
        <template #header>
          <div class="flex flex-wrap align-items-center justify-content-between gap-2">
            <span class="text-xl text-900 font-bold">Inventory</span>
            <Button icon="pi pi-refresh" rounded raised @click="fetchData" />
          </div>
        </template>
        <Column selectionMode="multiple" />
        <Column header="Image">
          <template #body="{ data }">
            <ImageColumn :img="data.image" />
          </template>
        </Column>
        <Column field="name" header="Name" sortable />
        <Column field="description" header="Description" />
        <Column field="category" header="Category" sortable />
        <Column field="pTag" header="P-Tag" sortable />
        <Column field="location" header="Location" sortable />
        <Column field="date" header="Date">
          <template #body="{ data }">
            {{ Date(data.date).toString() }}
          </template>
        </Column>
        <Column field="status" header="Status" :showFilterMenu="false" :filterMenuStyle="{ width: '14rem' }">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="getSeverity(data.status)" />
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Select One" class="p-column-filter" style="min-width: 12rem" :showClear="true">
              <template #option="{ option }">
                <Tag :value="option" :severity="getSeverity(option)" />
              </template>
            </Dropdown>
          </template>
        </Column>
      </DataTable>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { FilterMatchMode } from 'primevue/api';
import ImageColumn from '@/components/ImageColumn.vue';
import { isDev } from '@/utils/env';
import sleep from '@/utils/sleep';

const inventory = ref([]);
const loading = ref(false);
const selectedInventory = ref();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const statuses = ref(['available', 'unavailable']);

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
    inventory.value = json;
    loading.value = false;
  } catch (err) {
    console.error(err);
  }
}

function getSeverity(status) {
  if (status === 'unavailable') {
    return 'danger';
  }
  return 'success';
}

function clearSelection(event) {
  const currentSelection = (event.length && event.length <= 2) ? event[event.length - 1] : null;
  selectedInventory.value = (currentSelection) ? [currentSelection] : [];
}

// fetch the data when the view is created and the data is
// already being observed
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

:deep([data-pc-section="headercheckboxwrapper"]) {
  display: none;
}
</style>
