<template>
  <Toast />
  <div class="card">
    <!-- Toggle between table and calendar view? -->
    <ProgressBar v-if="loading" mode="indeterminate" style="height: 6px" />

    <div v-else class="calendar">
      <FullCalendar :options="calendarOptions" ref="calendar" />
    </div>
  </div>
  <Dialog v-model:visible="dialogVisible" modal header="Reservation Request Details" style="min-width: 30rem">
    <div class="dialog-content">
      <p>Building: {{ selectedReservation.building }}</p>
      <p>Room: {{ selectedReservation.room }}</p>
      <p class="req-by">Requested By:
        <ProfileName
          :name="selectedReservation.requestedBy"
          :netId="selectedReservation.reqNetId" />
      </p>
      <p>Date: {{ formatDate(selectedReservation.date) }}</p>
      <p>Time:
        {{ formatTime(selectedReservation.time) }} - {{ formatTime(selectedReservation.time + 1) }}
      </p>
      <div class="dialog-buttons">
        <Button
          type="button"
          icon="pi pi-check-square"
          severity="success"
          label="Approve"
          @click="approveRequest" />
        <Button
          type="button"
          icon="pi pi-times"
          severity="danger"
          label="Deny"
          @click="denyRequest" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import FullCalendar from '@fullcalendar/vue3';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ProgressBar from 'primevue/progressbar';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import ProfileName from '@/components/inventory-list/ProfileName.vue';
import { useRoomReservationStore } from '@/store';
import { storeToRefs } from 'pinia';
import { formatDate } from '@/utils/dataTableFilters';

// get the room store
const roomReservationStore = useRoomReservationStore();
const { roomReservations } = storeToRefs(roomReservationStore);

// initialize the toast notifications
const toast = useToast();
const toastDuration = 5000;

// create the reactive variables
const loading = ref(false);
const calendar = ref(null);
const events = ref([]);
const selectedReservation = ref(null);
const dialogVisible = ref(false);

// create a different color for each building
// https://stackoverflow.com/a/3426956
function stringToColor(string, saturation = 100, lightness = 75) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
    // eslint-disable-next-line no-bitwise
    hash &= hash;
  }
  return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%)`;
}

// calculate text color based on background color
// https://stackoverflow.com/a/3943023
function getContrastYIQ(hex) {
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  // eslint-disable-next-line no-bitwise
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
}

// convert 0-23 hour to 12 hour time
function formatTime(time) {
  if (time === 0) {
    return '12am';
  }
  if (time < 12) {
    return `${time}am`;
  }
  if (time === 12) {
    return '12pm';
  }
  return `${time - 12}pm`;
}

function setEvents() {
  // console.log(info);
  events.value = [];
  const tempEvents = [];
  roomReservations.value.forEach((r) => {
    const {
      building,
      room,
      date,
      time,
    } = r;

    // create new date from date+time for start
    const start = new Date(date);
    start.setHours(time, 0, 0, 0);

    // add one hour for end
    const end = new Date(start);
    end.setHours(time + 1);

    const buildingColor = stringToColor(building, 80, 30);

    tempEvents.push({
      // https://fullcalendar.io/docs/event-object
      title: `${building} ${room} by ${r.requestedBy} (${r.reqNetId})`, // `${building} - ${room}`,
      start,
      end,
      color: `${buildingColor}`,
      textColor: getContrastYIQ(buildingColor),
      extendedProps: {
        reservation: r,
      },
    });
  });
  events.value = tempEvents;
}

// approve the selected reservation request
async function approveRequest() {
  try {
    await roomReservationStore.approveRequest(selectedReservation.value);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Reservation request approved',
      life: toastDuration,
    });
    dialogVisible.value = false;
    // await roomReservationStore.fetchAll();
    setEvents();
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to approve reservation request',
      life: toastDuration,
    });
  }
}

// deny the selected reservation request
async function denyRequest() {
  try {
    await roomReservationStore.denyRequest(selectedReservation.value);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Reservation request denied',
      life: toastDuration,
    });
    dialogVisible.value = false;
    // await roomReservationStore.fetchAll();
    setEvents();
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to deny reservation request',
      life: toastDuration,
    });
  }
}

const calendarOptions = reactive({
  // https://fullcalendar.io/docs/timegrid-view
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'timeGridWeek,timeGridDay',
  },
  allDaySlot: false,
  slotDuration: '00:30:00',
  height: '100%',
  expandRows: true,
  selectable: false,
  selectOverlap: false,
  eventMouseEnter: (mouseEnterInfo) => {
    mouseEnterInfo.el.style.cursor = 'pointer';
  },
  eventClick: (eventClickInfo) => {
    // open dialog to approve or deny reservation request
    selectedReservation.value = eventClickInfo.event.extendedProps.reservation;
    dialogVisible.value = true;
  },
  events,
});

onMounted(async () => {
  loading.value = true;
  await roomReservationStore.fetchAll();
  setEvents();
  loading.value = false;
});
</script>

<style scoped>
.card {
  height: 100%;
  background: #2a323d;
  padding: 1rem;
  border-radius: 0 0 4px 4px;
  display: flex;
  flex-direction: column;
}

.calendar {
  height: 100%;
}

:deep(.fc .fc-bg-event) {
  opacity: 0.8;
}

.req-by div {
  display: inline-block;
}

.dialog-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
}
</style>
