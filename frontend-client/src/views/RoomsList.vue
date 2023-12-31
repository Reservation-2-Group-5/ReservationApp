<template>
  <div class="card">
    <div class="top">
      <Dropdown :loading="loading" v-model="selectedRoom" :options="groupedRooms" optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" :placeholder="dropdownPlaceholder" style="width: fit-content" @update:modelValue="setEvents" ref="dropdown" />
      <h3 v-if="selectedRoom">{{ selectedRoom.value.split(";").join(" - ") }}</h3>
      <div ref="padder" class="padder" />
    </div>
    <ProgressBar v-if="loading" mode="indeterminate" style="height: 6px" />

    <div v-if="selectedRoom" class="calendar">
      <FullCalendar :options="calendarOptions" ref="calendar" />
    </div>
  </div>
  <Dialog v-model:visible="dialogVisible" :position="dialogPosition" modal :style="{ width: '50vw' }">
    <template #container="slotProps">
      <Card class="card">
        <template #title>
          Reserving Room
          <Divider />
        </template>
        <template #content>
          <div class="dialog-details">
            <h1>{{ formatDate(selectedDay) }}</h1>
          </div>
          <div class="dialog-date-selections">
            <span class="p-float-label">
              <Calendar
                v-model="selectedStartDate"
                inputId="reservation-start-date"
                timeOnly
                hourFormat="12"
                selectionMode="single"
                :stepMinute="60"
                showIcon
                hideOnDateTimeSelect
                timeSeparator=""
                @update:modelValue="disallowMinutes"
                :pt="{
                  minutePicker: { style: 'display: none' },
                  separatorContainer: { style: 'padding: 0 0.25rem' },
                }" />
              <label for="reservation-start-date">Reservation Start Date</label>
            </span>
            <span class="p-float-label">
              <Calendar
                v-model="selectedEndDate"
                inputId="reservation-end-date"
                timeOnly
                hourFormat="12"
                :minDate="minEndDate"
                selectionMode="single"
                :stepMinute="60"
                showIcon
                :disabled="reservationEndDateDisabled"
                hideOnDateTimeSelect
                timeSeparator=""
                @update:modelValue="disallowMinutes"
                :pt="{
                  minutePicker: { style: 'display: none' },
                  separatorContainer: { style: 'padding: 0 0.25rem' },
                }" />
              <label for="reservation-end-date">Reservation End Date</label>
            </span>
          </div>
          <div class="dialog-details">
            <div class="dialog-details-inner">
              <p><span class="bold">Building:</span> {{ selectedRoom.value.split(";")[0] }}</p>
              <p><span class="bold">Room:</span> {{ selectedRoom.value.split(";")[1] }}</p>
              <p><span class="bold">Max Occupancy:</span> {{ selectedRoomOccupancy }}</p>
              <p><span class="bold">Type:</span> {{ selectedRoomType }}</p>
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
  ref,
  onMounted,
  computed,
  reactive,
  watch,
} from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ProgressBar from 'primevue/progressbar';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Calendar from 'primevue/calendar';
import toast from '@/utils/toastWrapper';
import { formatDate } from '@/utils/dataTableFilters';
import { useRoomStore, useUserStore, useRoomReservationStore } from '@/store';
import { storeToRefs } from 'pinia';

const unavailableColor = '#66000088';
const pendingColor = '#885000';
const ownColor = '#006600';

// get the room store
const roomStore = useRoomStore();
const { rooms } = storeToRefs(roomStore);
const userStore = useUserStore();
const roomReservationStore = useRoomReservationStore();

// create the reactive variables
const loading = ref(false);
const calendar = ref(null);
const events = ref([]);
const selectedRoom = ref(null);
const selectedRoomOccupancy = ref(null);
const selectedRoomType = ref(null);
const groupedRooms = ref([]);
const padder = ref(null);
const dropdown = ref(null);
const selectedDay = ref(null);
const selectedStartDate = ref(null);
const selectedEndDate = ref(null);

const dialogVisible = ref(false);
const dialogPosition = ref('top');
const minEndDate = ref(null);
const reservationEndDateDisabled = ref(true);

// round minutes of date to the nearest hour
function disallowMinutes(date) {
  date.setMinutes(0, 0, 0); // Resets seconds and milliseconds to 0
  return date;
}

function setEvents() {
  events.value = [];
  if (!selectedRoom.value) return;
  const tempEvents = [];
  rooms.value.forEach((r) => {
    if (r.available === 'available') return;
    const [currentBuilding, currentRoom] = selectedRoom.value.value.split(';');
    if (!currentBuilding || !currentRoom) return;
    if (r.building !== currentBuilding) return;
    if (r.room !== currentRoom) return;
    const {
      date,
      time,
    } = r;

    selectedRoomOccupancy.value = r.maxOccupancy;
    selectedRoomType.value = (r.isOffice) ? 'Office' : 'Conference Room';

    // create new date from date+time for start
    const start = new Date(date);
    start.setHours(time, 0, 0, 0);

    // add one hour for end
    const end = new Date(start);
    end.setHours(time + 1);

    const isPending = !(r.reservedBy && r.reservedByNetId);
    tempEvents.push({
      // https://fullcalendar.io/docs/event-object
      title: (isPending) ? 'Pending approval' : `${r.reservedBy} (${r.reservedByNetId})`,
      start,
      end,
      // eslint-disable-next-line no-nested-ternary
      color: (isPending) ? pendingColor
        : (r.reservedByNetId === userStore.user.netId) ? ownColor : unavailableColor,
      textColor: '#eee',
      display: 'background',
    });
  });
  events.value = tempEvents;
}

const dropdownPlaceholder = computed(() => (loading.value ? 'Loading...' : 'Select a room'));
const roomsByBuilding = computed(() => {
  const container = {};
  rooms.value.forEach((room) => {
    const { building, room: roomName } = room;
    if (!container[building]) {
      container[building] = [];
    }
    if (!container[building].includes(roomName)) {
      container[building].push(roomName);
    }
  });
  return container;
});

function clearSelection() {
  // clear the selection
  calendar.value.getApi().unselect();
  selectedDay.value = null;
  selectedStartDate.value = null;
  selectedEndDate.value = null;
}

async function handleSubmit() {
  if (!selectedStartDate.value || !selectedEndDate.value) {
    toast.error({
      title: 'Invalid date',
      content: 'Please select a start and end date',
      position: 'bottom-center',
    });
    return false;
  }
  if (selectedStartDate.value >= selectedEndDate.value) {
    toast.error({
      title: 'Invalid date range',
      content: 'Start date must be before end date',
      position: 'bottom-center',
    });
    return false;
  }
  if (selectedStartDate.value.toLocaleDateString() !== selectedEndDate.value.toLocaleDateString()) {
    toast.error({
      title: 'Invalid date range',
      content: 'Start date and end date must be on the same day',
      position: 'bottom-center',
    });
    return false;
  }
  const [building, room] = selectedRoom.value.value.split(';');
  const start = selectedStartDate.value.toLocaleDateString();
  const date = selectedStartDate.value.toLocaleDateString();
  const startHour = selectedStartDate.value.getHours();
  const endHour = selectedEndDate.value.getHours();

  // find room entries that match the selected room and time blocks
  const roomEntries = rooms.value.filter((r) => r.building === building
    && r.room === room
    && r.time >= startHour
    && r.time < endHour
    && r.date.toLocaleDateString() === date);

  // ensure that the room is available for the selected time blocks
  const unavailableEntries = roomEntries.filter((r) => r.available !== 'available');
  if (unavailableEntries.length > 0) {
    toast.error({
      title: 'Unavailable',
      content: `Your time selection overlaps an existing reservation for ${building} - ${room}`,
      position: 'bottom-center',
    });
    return false;
  }

  const startTimeStr = selectedStartDate.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTimeStr = selectedEndDate.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  console.log(roomEntries); // all the room entries that match the selected room and time blocks
  // if there are no room entries, then the user is trying to request too far in advance
  // the db hasn't seeded any room entries more than 30 days in advance
  if (roomEntries.length === 0) {
    toast.error({
      title: 'Invalid date range',
      content: 'You cannot reserve a room more than 30 days in advance',
      position: 'bottom-center',
    });
    return false;
  }

  // add netid to room entries
  for (const entry of roomEntries) {
    entry.reqNetId = userStore.user.netId;
  }
  try {
    await roomReservationStore.createReservation(roomEntries);

    // add the events to the calendar
    const tempEvents = [];
    for (const entry of roomEntries) {
      // use the date from the room entry
      const startDate = new Date(entry.date);
      startDate.setHours(entry.time, 0, 0, 0);
      const endDate = new Date(entry.date);
      endDate.setHours(entry.time + 1, 0, 0, 0);

      tempEvents.push({
        title: `Pending approval - ${userStore.user.netId}`,
        start: startDate,
        end: endDate,
        color: pendingColor,
        textColor: '#fff',
        display: 'background',
      });
    }
    // add the events to the calendar
    calendar.value.getApi().addEventSource(tempEvents);

    toast.success({
      title: 'Submitted Reservation Request!',
      content: `${building} - ${room} requested for ${start} from ${startTimeStr} to ${endTimeStr}.`,
    });
    return true;
  } catch (error) {
    toast.error({
      title: 'Error',
      content: 'Failed to submit reservation request',
      position: 'bottom-center',
    });
    console.error(error);
    return false;
  }
}

// close the dialog box
function closeDialog(closeFn) {
  dialogVisible.value = false;
  clearSelection();
  closeFn();
}

// submit the reservation
async function submitReservation(closeFn) {
  const close = await handleSubmit();
  if (close) {
    closeDialog(closeFn);
  }
}

function handleSelect(selectionInfo) {
  if (selectionInfo.startStr === selectedStartDate.value) {
    clearSelection();
  } else if (!userStore.isLoggedIn) {
    toast.error({
      title: 'Error',
      content: 'You must be logged in to reserve a room.',
    });
    clearSelection();
  } else {
    selectedDay.value = selectionInfo.start;
    selectedStartDate.value = selectionInfo.start;
    selectedEndDate.value = selectionInfo.end;
    dialogVisible.value = true;
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
  slotDuration: '01:00:00',
  height: '100%',
  expandRows: true,
  selectable: true,
  selectOverlap: false,
  select: handleSelect,
  eventMouseEnter: (mouseEnterInfo) => {
    // set cursor to disabled if time slot is not available
    if (mouseEnterInfo.event.display === 'background') {
      mouseEnterInfo.el.style.cursor = 'not-allowed';
    }
  },
  eventClick: (clickInfo) => {
    // prevent click if event is not available
    if (clickInfo.event.display === 'background') {
      clickInfo.jsEvent.preventDefault();
      clickInfo.jsEvent.stopPropagation();
      // send toast notification
      const [building, room] = selectedRoom.value.value.split(';');
      const time = clickInfo.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const date = clickInfo.event.start.toLocaleDateString();
      toast.error({
        title: 'Unavailable',
        content: `${building} - ${room} is unavailable at ${time} on ${date}.`,
        position: 'bottom-center',
      });
    }
  },
  events,
});

watch(selectedStartDate, (newVal) => {
  if (newVal && newVal instanceof Date) {
    reservationEndDateDisabled.value = false;
    minEndDate.value = new Date(newVal);
  } else {
    reservationEndDateDisabled.value = true;
  }
});

onMounted(async () => {
  loading.value = true;
  try {
    await roomStore.fetchAll();
    // create an array of unique building labels with an items key for the rooms
    groupedRooms.value = Object.keys(roomsByBuilding.value).map((building) => ({
      label: building,
      items: roomsByBuilding.value[building].map((room) => {
        const occupancy = rooms.value
          .find((r) => r.building === building && r.room === room).maxOccupancy;
        return {
          label: `${room} (Capacity ${occupancy})`,
          value: `${building};${room}`,
        };
      }),
    }));
  } catch (error) {
    toast.error({
      title: 'Error',
      content: 'Failed to fetch rooms',
    });
    console.error(error);
  } finally {
    loading.value = false;
    // get the width from bounding rect of the dropdown
    const { width } = dropdown.value.$el.getBoundingClientRect();
    // set the width of the padder to the width of the dropdown
    padder.value.style.width = `${width}px`;
  }
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

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.padder {
  display: flex;
  justify-content: flex-end;
}

:deep(.p-tabview-panels) {
  padding-left: 0;
  padding-top: 5px;
}

:deep(.fc .fc-bg-event) {
  opacity: 0.8;
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
  margin-bottom: 2rem;
}

:deep(.p-card-content) {
  padding: 0;
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

:deep(.minute-time-picker) {
  display: none;
}
</style>
