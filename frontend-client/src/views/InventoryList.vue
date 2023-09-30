<template>
  <main>
    <div class="card">
      <DataTable
        :loading="loading"
        paginator
        removableSort
        :rows="5"
        :value="inventory"
        tableStyle="min-width: 50rem">
        <template #header>
          <div class="flex flex-wrap align-items-center justify-content-between gap-2">
            <span class="text-xl text-900 font-bold">Inventory</span>
            <Button icon="pi pi-refresh" rounded raised @click="fetchData" />
          </div>
        </template>
        <Column header="Image">
          <template #body="slotProps">
            <div class="card flex justify-content-center">
              <img
                :src="`${slotProps.data.image}?width=50&now=${Date.now()}`"
                :alt="slotProps.image"
                class="w-6rem shadow-2 border-round"
                @click="toggle"
                style="cursor:pointer" />

              <OverlayPanel ref="op">
                <img :src="`${slotProps.data.image}?width=200&now=${Date.now()}`" alt="Cat" />
              </OverlayPanel>
            </div>
          </template>
        </Column>
        <Column field="name" header="Name" sortable />
        <Column field="description" header="Description" />
        <Column field="category" header="Category" sortable />
        <Column field="pTag" header="P-Tag" sortable />
        <Column field="location" header="Location" sortable />
        <Column field="date" header="Date">
          <template #body="slotProps">
            {{ Date(slotProps.data.date).toString() }}
          </template>
        </Column>
        <Column header="Status">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.status"
              :severity="getSeverity(slotProps.data)" />
          </template>
        </Column>
        <template #footer>
          In total there are {{ inventory ? inventory.length : 0 }} inventory items.
        </template>
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
import OverlayPanel from 'primevue/overlaypanel';
import { isDev } from '@/utils/env';
import sleep from '@/utils/sleep';

const inventory = ref([]);
const loading = ref(false);
const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
};

async function fetchDevData() {
  try {
    const response = await fetch('testData.json');
    const json = await response.json();

    // Simulate a delay
    await sleep(1000);

    inventory.value = json;
    loading.value = false;
  } catch (err) {
    console.error(err);
    inventory.value = [];
    loading.value = false;
  }
}

async function fetchData() {
  inventory.value = [];
  loading.value = true;
  if (isDev) {
    await fetchDevData();
    return;
  }
  try {
    const response = await fetch('db');
    const json = await response.json();
    inventory.value = json;
    loading.value = false;
  } catch (err) {
    console.error(err);
  }
}

function getSeverity(slotProps) {
  console.log('props', slotProps);
  if (slotProps.status === 'unavailable') {
    return 'danger';
  }
  return 'success';
}

// fetch the data when the view is created and the data is
// already being observed
onMounted(fetchData);
</script>

<style scoped>
main {
  max-height: calc(100vh - 64px);
}
</style>
