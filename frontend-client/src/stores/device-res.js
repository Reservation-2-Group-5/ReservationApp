import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { BASE_API, fixDate } from '@/utils/APIUtils';

const API = `${BASE_API}/device-res`;

const formatDeviceReservationData = (data) => {
  const formattedData = [];
  for (const res of data) {
    const newRes = {};

    newRes.tag = res.Tag;
    newRes.category = res.Model_Category;
    newRes.name = res.Device_Display_Name;
    newRes.assignedTo = res.Assigned_To;
    newRes.netId = res.Reserved_NetID;
    newRes.location = res.Location;
    newRes.fundingSource = res.Funding_Source;
    newRes.department = res.Dept_Ownership;
    newRes.serialNumber = res.Serial_Number;
    newRes.poNumber = res.PO;
    newRes.warrantyExpiration = fixDate(res.Warranty_EXP);
    newRes.available = (res.Available) ? 'available' : 'unavailable';

    newRes.id = res.id;
    newRes.requestedEndDate = fixDate(res.End_Date);
    newRes.requestedBy = res.Name;
    newRes.reqNetId = res.NetID;
    newRes.requestedOnDate = fixDate(res.Request_Date);
    newRes.requestedStartDate = fixDate(res.Start_Date);

    formattedData.push(newRes);
  }
  return formattedData;
};

const useDeviceReservationStore = defineStore('deviceReservation', () => {
  const deviceReservations = ref([]);

  const setReservations = (newReservations) => {
    deviceReservations.value = formatDeviceReservationData(newReservations);
  };

  const fetchReservations = async () => {
    try {
      // Check if /api is accessible
      // const useApi = await apiAccessible();
      // if (!useApi) return; // don't fetch if api is not accessible

      // Fetch device reservations
      const response = await fetch(API);
      console.log('device-res response', response);
      const json = await response.json();
      console.log('device-res json', json);
      setReservations(json);
    } catch (err) {
      console.error(err);
    }
  };

  // update the request in the db
  const editRequest = async (res, to) => {
    const body = {
      status: (to) ? 'approved' : 'denied',
      NetID: res.reqNetId,
      Name: res.requestedBy,
    };
    const response = await fetch(`${API}/${res.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    console.log('put device-res response', response);
    const json = await response.json();
    console.log('put device-res json', json);
    if (response.status === 500 || response.status === 400) {
      throw new Error(json.message);
    }
  };

  // locally update the request
  const setRequest = async (res, to) => {
    for (const reservation of deviceReservations.value) {
      if (reservation.id === res.id) {
        reservation.approved = to;
        // remove the request from the list locally
        deviceReservations.value = deviceReservations.value.filter(
          (fRes) => fRes.tag !== reservation.tag,
        );
      }
    }
    await editRequest(res, to);
  };

  const createReservation = async (res) => {
    const body = {
      Tag: res.tag,
      NetID: res.reqNetId,
      Start_Date: res.requestedStartDate,
      End_Date: res.requestedEndDate,
    };
    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    console.log('post device-res response', response);
    const json = await response.json();
    console.log('post device-res json', json);
    if (response.status === 500 || response.status === 400) {
      throw new Error('Error creating reservation');
    }
  };

  const approveRequest = (res) => setRequest(res, true);

  const denyRequest = (res) => setRequest(res, false);

  const fetchAll = async () => {
    await fetchReservations();
  };

  const getAll = computed(() => deviceReservations.value);

  return {
    deviceReservations,
    setReservations,
    fetchReservations,
    approveRequest,
    denyRequest,
    fetchAll,
    getAll,
    createReservation,
  };
});

export default useDeviceReservationStore;
