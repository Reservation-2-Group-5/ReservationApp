<template>
  <div class="card">
    <!-- Toggle between table and calendar view? -->
    <ProgressBar v-if="loading" mode="indeterminate" style="height: 6px" />

    <div v-else class="calendar">
      <FullCalendar :options="calendarOptions" ref="calendar" />
    </div>
  </div>
  <Dialog v-model:visible="dialogVisible" modal header="Reservation Request Details" style="min-width: 30rem">
    <div class="dialog-content">
      <p>Building: {{ selectedReservation[0].building }}</p>
      <p>Room: {{ selectedReservation[0].room }}</p>
      <p class="req-by">Requested By:
        <ProfileName
          :name="selectedReservation[0].requestedBy"
          :netId="selectedReservation[0].reqNetId" />
      </p>
      <p>Date: {{ formatDate(selectedReservation[0].date) }}</p>
      <p>Time:
        {{ formatTime(selectedReservation[0].time) }}
        -
        {{ formatTime(selectedReservation[selectedReservation.length - 1].time + 1) }}
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
import FullCalendar from '@fullcalendar/vue3';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ProgressBar from 'primevue/progressbar';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import ProfileName from '@/components/inventory-list/ProfileName.vue';
import toast from '@/utils/toastWrapper';
import { useRoomReservationStore } from '@/store';
import { storeToRefs } from 'pinia';
import { formatDate } from '@/utils/dataTableFilters';

// get the room store
const roomReservationStore = useRoomReservationStore();
const { roomReservations } = storeToRefs(roomReservationStore);

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

  // find tempEvents that are sequential by the same person and combine them into one event

  // sort by start time
  tempEvents.sort((a, b) => {
    if (a.extendedProps.reservation.building !== b.extendedProps.reservation.building) {
      return a.extendedProps.reservation.building
        .localeCompare(b.extendedProps.reservation.building);
    }

    if (a.extendedProps.reservation.room !== b.extendedProps.reservation.room) {
      return a.extendedProps.reservation.room
        .localeCompare(b.extendedProps.reservation.room);
    }

    // compare by date (ignoring time)
    const aDate = new Date(a.start).setHours(0, 0, 0, 0);
    const bDate = new Date(b.start).setHours(0, 0, 0, 0);
    if (aDate !== bDate) {
      return aDate - bDate;
    }

    // finally compare by start time
    return a.start.getTime() - b.start.getTime();
  });

  // array to hold the final events
  const finalEvents = [];

  // find chain of sequential events for the same person in the same building and room
  let sequentialEvents = [tempEvents[0]];

  for (let i = 0; i < tempEvents.length - 1; i += 1) {
    const currentEnd = new Date(tempEvents[i].end);
    const nextStart = new Date(tempEvents[i + 1].start);

    const currentReservation = tempEvents[i].extendedProps.reservation;
    const nextReservation = tempEvents[i + 1].extendedProps.reservation;

    // if the end time of the current event is the same as the start time of the next event
    // and the reqNetId, building, and room are the same for both events
    if (
      currentEnd.getTime() === nextStart.getTime()
      && currentReservation.reqNetId === nextReservation.reqNetId
      && currentReservation.building === nextReservation.building
      && currentReservation.room === nextReservation.room
    ) {
      sequentialEvents.push(tempEvents[i + 1]);
    } else {
      // create a new event with the start time of the first event
      // and the end time of the last event in the sequence
      const newEvent = {
        ...sequentialEvents[0],
        end: sequentialEvents[sequentialEvents.length - 1].end,
        extendedProps: {
          ...sequentialEvents[0].extendedProps,
          reservations: sequentialEvents.map((event) => event.extendedProps.reservation),
        },
      };

      finalEvents.push(newEvent);

      // reset the sequentialEvents array for the next chain
      sequentialEvents = [tempEvents[i + 1]];
    }
  }

  // handle the last chain of sequential events
  if (sequentialEvents.length > 0) {
    const newEvent = {
      ...sequentialEvents[0],
      end: sequentialEvents[sequentialEvents.length - 1].end,
      extendedProps: {
        ...sequentialEvents[0].extendedProps,
        reservations: sequentialEvents.map((event) => event.extendedProps.reservation),
      },
    };

    finalEvents.push(newEvent);
  }

  events.value = finalEvents;
}

// approve the selected reservation request
async function approveRequest() {
  try {
    await roomReservationStore.approveRequest(selectedReservation.value);
    toast.success({
      title: 'Success',
      content: 'Reservation request approved',
    });
    setEvents();
  } catch (err) {
    toast.error({
      title: 'Error',
      content: 'Failed to approve reservation request',
    });
  }
  dialogVisible.value = false;
}

// deny the selected reservation request
async function denyRequest() {
  try {
    await roomReservationStore.denyRequest(selectedReservation.value);
    toast.info({
      title: 'Success',
      content: 'Reservation request denied',
    });
    dialogVisible.value = false;
    // await roomReservationStore.fetchAll();
    setEvents();
  } catch (err) {
    toast.error({
      title: 'Error',
      content: 'Failed to deny reservation request',
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
    const { reservations, reservation } = eventClickInfo.event.extendedProps;
    selectedReservation.value = reservations || reservation;
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
