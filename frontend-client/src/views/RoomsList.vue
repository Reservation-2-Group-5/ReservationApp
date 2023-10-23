<template>
  <Toast />
  <div class="card">
    <DataTable
      :loading="loading"
      v-model:selection="selectedRooms"
      v-model:filters="filters"
      filterDisplay="menu"
      :value="rooms"
      @update:selection="clearSelection"
      :metaKeySelection="false"
      paginator
      removableSort
      scrollable
      scrollHeight="flex"
      :rows="10"
      paginatorTemplate="JumpToPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 25, 50]"
      currentPageReportTemplate="Showing {first}-{last} of {totalRecords}"
      :globalFilterFields="[]"
      tableStyle="min-width: 50rem;"
      class="room-table">
      <template #header>
        <HeaderPanel
          name="Rooms List"
          :filters="filters"
          :fetchData="requestData"
          :clearFilters="clearFilter"
          @inputUpdate="filters['global'].value = $event" />
      </template>
      <template #empty v-if="!loading">No rooms found.</template>
      <Column selectionMode="multiple" />
      <Column field="building" header="Building" v-bind="filterAttributes">
        <template #body="{ data }">
          {{ data.building }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="buildings" placeholder="Any" class="p-column-filter" />
        </template>
      </Column>
      <Column field="room" header="Room" v-bind="filterAttributes">
        <template #body="{ data }">
          {{ data.room }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="roomNumbers" placeholder="Any" class="p-column-filter" />
        </template>
      </Column>

      <!-- TODO: Combine date+time and use a calendar range selector -->
      <Column field="date" header="Date" dataType="date" v-bind="filterAttributes" :showFilterMatchModes="true" :maxConstraints="2">
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" showButtonBar selectionMode="single" showIcon :showOnFocus="false" />
        </template>
      </Column>
      <Column field="time" header="Time" v-bind="filterAttributes">
        <template #body="{ data }">
          {{ data.time }}
        </template>
        <template #filter="{ filterModel }">
          <Slider v-model="filterModel.value" range class="m-3" :min="0" :max="23" />
          <div class="flex align-items-center justify-content-between px-2">
            <span>{{ numToTime((filterModel.value?.[0]) ? filterModel.value[0] : 0) }}</span>
            <span>{{ numToTime((filterModel.value?.[1]) ? filterModel.value[1] : 23) }}</span>
          </div>
        </template>
      </Column>

      <Column field="maxOccupancy" header="Max Occupancy" v-bind="filterAttributes">
        <template #body="{ data }">
          {{ data.maxOccupancy }}
        </template>
        <template #filter="{ filterModel }">
          <Slider v-model="filterModel.value" range class="m-3" :min="minMaxOccupancy[0]" :max="minMaxOccupancy[1]" />
          <div class="flex align-items-center justify-content-between px-2">
            <span>{{ filterModel.value ? filterModel.value[0] : minMaxOccupancy[0] }}</span>
            <span>{{ filterModel.value ? filterModel.value[1] : minMaxOccupancy[1] }}</span>
          </div>
        </template>
      </Column>
      <Column field="reservedBy" header="Reserved By" v-bind="filterAttributes">
        <template #body="{ data }">
          <ProfileName
            :name="data.reservedBy"
            :image="placeholderAvatar"
            :netId="data.reservedByNetId" />
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="reservees" placeholder="Any" class="p-column-filter">
            <template #option="slotProps">
              <ProfileName :name="slotProps.option" :image="placeholderAvatar" />
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column field="type" header="Type" v-bind="filterAttributes">
        <template #body="{ data }">
          {{ data.type }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="roomTypes" placeholder="Any" class="p-column-filter" />
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
          Reserving Room
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
            <h1>{{ selectedRooms[0].name }}</h1>
            <div class="dialog-details-inner">
              <p><span class="bold">Building:</span> {{ selectedRooms[0].building }}</p>
              <p><span class="bold">Room:</span> {{ selectedRooms[0].room }}</p>
              <p><span class="bold">Date:</span> {{ formatDate(selectedRooms[0].date) }}</p>
              <p><span class="bold">Time:</span> {{ selectedRooms[0].time }}</p>
              <p><span class="bold">Max Occupancy:</span> {{ selectedRooms[0].maxOccupancy }}</p>
              <p><span class="bold">Reserved By:</span> {{ `${selectedRooms[0].reservedBy} (${selectedRooms[0].reservedByNetId})` }}</p>
              <p><span class="bold">Type:</span> {{ selectedRooms[0].type }}</p>
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
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import Slider from 'primevue/slider';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import HeaderPanel from '@/components/inventory-list/HeaderPanel.vue';
import ProfileName from '@/components/inventory-list/ProfileName.vue';
import { useRoomStore } from '@/store';
import {
  formatDate,
  initFilters,
  fetchData,
  clearFilters,
} from '@/utils/dataTableFilters';

const placeholderAvatar = 'https://images.placeholders.dev/?width=32&height=32';

// get the inventory store
const roomStore = useRoomStore();
// const inventoryList = ref([]);
const { rooms } = storeToRefs(roomStore);

// initialize the toast notifications
const toast = useToast();
const toastDuration = 5000;

// create the reactive variables
const loading = ref(false);
const selectedRooms = ref();
const statuses = ref([]);
const buildings = ref([]);
const roomNumbers = ref([]);
const reservees = ref([]);
const roomTypes = ref([]);

const dialogVisible = ref(false);
const dialogPosition = ref('top');
const reservationStartDate = ref();
const reservationEndDate = ref();
const reservationEndDateDisabled = ref(true);

// set the default filter operators and constraints
const filters = ref();
const lists = {
  available: statuses,
  building: buildings,
  room: roomNumbers,
  reservedBy: reservees,
  type: roomTypes,
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

const minMaxOccupancy = computed(() => {
  const min = Math.min(...rooms.value.map((r) => r.maxOccupancy));
  const max = Math.max(...rooms.value.map((r) => r.maxOccupancy));
  return [min, max];
});

// clear the filters
const clearFilter = () => {
  clearFilters(filters);
  filters.value.available.constraints[0].value = 'available';
  filters.value.maxOccupancy.value = minMaxOccupancy.value;
};
onBeforeMount(() => {
  initFilters(filters);
  filters.value.available.constraints[0].value = 'available';
  filters.value.maxOccupancy.value = minMaxOccupancy.value;
});

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
  selectedRooms.value = (currentSelection) ? [currentSelection] : [];
}

function numToTime(num) {
  // input is a number from 0 to 23
  // output is a string in the format "hh AM/PM"
  if (num === 0) {
    return '12 AM';
  }
  if (num < 12) {
    return `${num} AM`;
  }
  if (num === 12) {
    return '12 PM';
  }
  return `${num - 12} PM`;
}

// submit the selected row
function submitSelection() {
  if (!selectedRooms.value?.length) {
    toast.add({
      severity: 'error',
      summary: 'No room selected',
      detail: 'Please select at least one room to submit',
      life: toastDuration,
    });
    return;
  }
  if (selectedRooms.value.length > 1) {
    toast.add({
      severity: 'warn',
      summary: 'Multiple rooms selected',
      detail: 'Only one room can be submitted at a time',
      life: toastDuration,
    });
    return;
  }

  // don't allow the user to submit request for an unavailable room
  if (selectedRooms.value[0].available === 'unavailable') {
    toast.add({
      severity: 'error',
      summary: 'Room is unavailable',
      detail: 'Please select an available room',
      life: toastDuration,
    });
    return;
  }

  console.log('selectedRooms', selectedRooms.value[0]);
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

  // TODO: submit reservation to server, mark item as unavailable
  toast.add({
    severity: 'success',
    summary: 'Reservation submitted',
    detail: `Your ${selectedRooms.value[0].name} reservation has been submitted for ${formatDate(reservationStartDate.value)} to ${formatDate(reservationEndDate.value)}}`,
    life: toastDuration,
  });
  selectedRooms.value[0].available = 'unavailable';
  selectedRooms.value = [];
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
  await fetchData(roomStore, loading, lists);
}

// fetch data when the view is created
onMounted(async () => {
  await requestData();
});
</script>

<style scoped>
.card {
  height: 100%;
}

.room-table {
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
