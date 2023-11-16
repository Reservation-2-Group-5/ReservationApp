import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { BASE_API, fixDate } from '@/utils/APIUtils';

const API = `${BASE_API}/room-res`;

const formatRoomReservationData = (data) => {
  const formattedData = [];
  for (const res of data) {
    const newRes = {};

    newRes.id = res.id;
    newRes.building = res.Building;
    newRes.room = res.RoomNumber;
    newRes.date = fixDate(res.Date);
    newRes.time = res.Time;
    newRes.available = (res.Available) ? 'available' : 'unavailable';
    newRes.reservedBy = res.Reserved_Name;
    newRes.reservedByNetId = res.Reserved_NetID;
    newRes.maxOccupancy = res.Max_Occupancy;
    newRes.type = (res.Is_Office) ? 'Office' : 'Conference';

    newRes.id = res.id;
    newRes.requestedBy = res.Name;
    newRes.reqNetId = res.NetID;
    newRes.requestedOnDate = fixDate(res.Request_Date);

    formattedData.push(newRes);
  }
  return formattedData;
};

const useRoomReservationStore = defineStore('roomReservation', () => {
  const roomReservations = ref([]);

  const setReservations = (newReservations) => {
    roomReservations.value = formatRoomReservationData(newReservations);
  };

  const fetchReservations = async () => {
    try {
      // Check if /api is accessible
      // const useApi = await apiAccessible();
      // if (!useApi) return; // don't fetch if api is not accessible

      // Fetch room reservations
      const response = await fetch(API);
      console.log('room-res response', response);
      const json = await response.json();
      console.log('room-res json', json);
      setReservations(json);
    } catch (err) {
      console.error(err);
    }
  };

  // update the request in the db
  const editRequest = async (resArr, to) => {
    const body = [];
    for (const res of resArr) {
      body.push({
        Building: res.building,
        RoomNumber: res.room,
        Date: res.date.getTime(),
        Time: res.time,
        NetID: res.reqNetId,
        Name: res.requestedBy,
        status: (to) ? 'approved' : 'denied',
      });
    }
    const response = await fetch(`${API}/${resArr[0].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    console.log('put room-res response', response);
    const json = await response.json();
    console.log('put room-res json', json);
    // match all error codes
    if (response.status === 500
      || response.status === 400
      || response.status === 404) {
      throw new Error(json.message);
    }
  };

  const setRequest = async (resArr, to) => {
    const ids = resArr.map((obj) => obj.id);
    for (const reservation of roomReservations.value) {
      if (ids.includes(reservation.id)) {
        reservation.approved = to;
        // remove the request from the list locally
        roomReservations.value = roomReservations.value.filter(
          (fRes) => fRes.building !== reservation.building
          || fRes.room !== reservation.room
          || fRes.date !== reservation.date
          || fRes.time !== reservation.time,
        );
      }
    }
    await editRequest(resArr, to);
  };

  const createReservation = async (resArr) => {
    const body = [];
    for (const res of resArr) {
      body.push({
        Building: res.building,
        RoomNumber: res.room,
        Date: res.date.getTime(),
        Time: res.time,
        NetID: res.reqNetId,
      });
    }
    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    console.log('post room-res response', response);
    const json = await response.json();
    console.log('post room-res json', json);
    if (response.status === 500 || response.status === 400) {
      throw new Error('Error creating reservation');
    }
  };

  const approveRequest = (resArr) => setRequest(resArr, true);

  const denyRequest = (resArr) => setRequest(resArr, false);

  const fetchAll = async () => {
    await fetchReservations();
  };

  const getAll = computed(() => roomReservations.value);

  return {
    roomReservations,
    setReservations,
    fetchReservations,
    approveRequest,
    denyRequest,
    fetchAll,
    getAll,
    createReservation,
  };
});

export default useRoomReservationStore;
