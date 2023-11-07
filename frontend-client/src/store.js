import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { isDev } from '@/utils/env';
import sleep from '@/utils/sleep';

const API = 'api/v1';

const apiAccessible = async () => {
  const apiLocation = '/api';
  const apiResponse = await fetch(apiLocation, { method: 'HEAD' });
  return apiResponse.status === 200;
};

const fixDate = (date) => {
  if (date && (typeof date === 'string' || typeof date === 'number')) {
    return new Date(date);
  }
  return date;
};

const formatInventoryData = (data) => {
  const formattedData = [];
  for (const item of data) {
    const newItem = {};
    newItem.tag = item.Tag;
    newItem.category = item.Model_Category;
    newItem.name = item.Device_Display_Name;
    newItem.assignedTo = item.Assigned_To;
    newItem.netId = item.Reserved_NetID;
    newItem.location = item.Location;
    newItem.fundingSource = item.Funding_Source;
    newItem.department = item.Dept_Ownership;
    newItem.serialNumber = item.Serial_Number;
    newItem.poNumber = item.PO;
    newItem.warrantyExpiration = fixDate(item.Warranty_EXP);
    newItem.available = (item.Available) ? 'available' : 'unavailable';

    formattedData.push(newItem);
  }
  return formattedData;
};

const formatRoomData = (data) => {
  const formattedData = [];
  for (const room of data) {
    const newRoom = {};
    newRoom.building = room.Building;
    newRoom.room = room.Room;
    newRoom.date = fixDate(room.Date);
    newRoom.time = room.Time;
    newRoom.available = (room.Available) ? 'available' : 'unavailable';
    newRoom.reservedBy = room.Reserved_Name;
    newRoom.reservedByNetId = room.Reserved_NetID;
    newRoom.maxOccupancy = room.Max_Occupancy;
    newRoom.type = (room.Is_Office) ? 'Office' : 'Conference';

    formattedData.push(newRoom);
  }
  return formattedData;
};

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

    newRes.requestedEndDate = fixDate(res.End_Date);
    newRes.requestedBy = res.Name;
    newRes.reqNetId = res.NetID;
    newRes.requestedOnDate = fixDate(res.Request_Date);
    newRes.requestedStartDate = fixDate(res.Start_Date);

    formattedData.push(newRes);
  }
  return formattedData;
};

const formatRoomReservationData = (data) => {
  const formattedData = [];
  for (const res of data) {
    const newRes = {};

    newRes.id = res.id;
    newRes.building = res.Building;
    newRes.room = res.Room;
    newRes.date = fixDate(res.Date);
    newRes.time = res.Time;
    newRes.available = (res.Available) ? 'available' : 'unavailable';
    newRes.reservedBy = res.Reserved_Name;
    newRes.reservedByNetId = res.Reserved_NetID;
    newRes.maxOccupancy = res.Max_Occupancy;
    newRes.type = (res.Is_Office) ? 'Office' : 'Conference';

    newRes.requestedBy = res.Name;
    newRes.reqNetId = res.NetID;
    newRes.requestedOnDate = fixDate(res.Request_Date);

    formattedData.push(newRes);
  }
  return formattedData;
};

export const useUserStore = defineStore('user', () => {
  const user = ref(null);

  const setUser = (newUser) => {
    user.value = newUser;
  };

  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  return {
    user,
    setUser,
    isLoggedIn,
    isAdmin,
  };
});

export const useInventoryStore = defineStore('inventory', () => {
  const inventory = ref([]);

  const setInventory = (newInventory) => {
    inventory.value = formatInventoryData(newInventory);
  };

  const fetchInventory = async () => {
    // const location = (isDev) ? 'realInventoryTestData.json' : 'db';
    // const location = 'api/v1/devices';
    const deviceResLocation = `${API}/devices`;
    const testDataLocation = 'realInventoryTestData.json';
    if (isDev) {
      // simulate a fetch delay
      await sleep(1000);
    }
    try {
      // Check if /api is accessible
      const useApi = await apiAccessible();
      const selectedLocation = (useApi) ? deviceResLocation : testDataLocation;

      // Fetch device reservations
      const response = await fetch(selectedLocation);
      const json = await response.json();
      setInventory(json);
    } catch (err) {
      console.error(err);
    }
  };

  const setItemImg = (id, img) => {
    for (const item of inventory.value) {
      if (item.id === id) {
        item.img = img;
      }
    }
  };

  const fetchAll = async () => {
    await fetchInventory();
  };

  const getAll = computed(() => inventory.value);

  return {
    inventory,
    setInventory,
    setItemImg,
    fetchInventory,
    fetchAll,
    getAll,
  };
});

export const useDeviceReservationStore = defineStore('deviceReservation', () => {
  const deviceReservations = ref([]);

  const setReservations = (newReservations) => {
    deviceReservations.value = formatDeviceReservationData(newReservations);
    let id = 0;

    const requestsExist = deviceReservations.value.filter((res) => !!res.requestedBy);
    if (requestsExist.length) return; // don't add fake data if real data exists

    for (const item of deviceReservations.value) {
      // Add reservation data to devices - simulate db JOIN query
      item.id = id;
      id += 1;
      // random requester
      item.requestedBy = `${
        ['John', 'Jane', 'Joe', 'Jill', 'Jack'][Math.floor(Math.random() * 5)]
      } ${
        ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 5)]
      }`;
      const firstInitial = item.requestedBy[0].toLowerCase();
      const lastName = item.requestedBy.split(' ')[1].toLowerCase();
      item.reqNetId = `${firstInitial}${lastName}`;
      // random date between now and 2 weeks from now
      item.requestedOnDate = new Date(Date.now() + Math.floor(Math.random() * 12096e5));
      item.requestedStartDate = new Date(item.requestedOnDate);
      item.requestedEndDate = new Date(item.requestedOnDate.getTime() + 2592e6);
    }
  };

  const fetchReservations = async () => {
    // const location = (isDev) ? 'realInventoryTestData.json' : 'db';
    // const location = 'api/v1/device-res';
    const deviceResLocation = `${API}/device-res`;
    const testDataLocation = 'realInventoryTestData.json';
    if (isDev) {
      // simulate a fetch delay
      await sleep(1000);
    }
    try {
      // Check if /api is accessible
      const useApi = await apiAccessible();
      const selectedLocation = (useApi) ? deviceResLocation : testDataLocation;

      // Fetch device reservations
      const response = await fetch(selectedLocation);
      const json = await response.json();

      setReservations(json);
    } catch (err) {
      console.error(err);
    }
  };

  const setRequest = (id, to) => {
    for (const reservation of deviceReservations.value) {
      if (reservation.id === id) {
        reservation.approved = to;
        // remove the request from the list
        deviceReservations.value = deviceReservations.value.filter(
          (res) => res.tag !== reservation.tag,
        );
      }
    }
  };

  const approveRequest = (id) => {
    setRequest(id, true);
  };

  const denyRequest = (id) => {
    setRequest(id, false);
  };

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
  };
});

export const useRoomStore = defineStore('rooms', () => {
  const rooms = ref([]);

  const setRooms = (newRooms) => {
    rooms.value = formatRoomData(newRooms);
  };

  const fetchRooms = async () => {
    // const location = (isDev) ? 'realRoomTestData.json' : 'db';
    // const location = 'api/v1/rooms';
    const deviceResLocation = `${API}/rooms`;
    const testDataLocation = 'realRoomTestData.json';
    if (isDev) {
      // simulate a fetch delay
      await sleep(1000);
    }
    try {
      // Check if /api is accessible
      const useApi = await apiAccessible();
      const selectedLocation = (useApi) ? deviceResLocation : testDataLocation;

      // Fetch device reservations
      const response = await fetch(selectedLocation);
      const json = await response.json();
      setRooms(json);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAll = async () => {
    await fetchRooms();
  };

  const getAll = computed(() => rooms.value);

  return {
    rooms,
    setRooms,
    fetchRooms,
    fetchAll,
    getAll,
  };
});

export const useRoomReservationStore = defineStore('roomReservation', () => {
  const roomReservations = ref([]);

  const setReservations = (newReservations) => {
    roomReservations.value = formatRoomReservationData(newReservations);
    let id = 0;

    const requestsExist = roomReservations.value.filter((res) => !!res.NetID);
    if (requestsExist.length) return; // don't add fake data if real data exists

    for (const room of roomReservations.value) {
      // Add reservation data to devices - simulate db JOIN query
      room.id = id;
      id += 1;
      // random requester
      room.requestedBy = `${
        ['John', 'Jane', 'Joe', 'Jill', 'Jack'][Math.floor(Math.random() * 5)]
      } ${
        ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 5)]
      }`;
      const firstInitial = room.requestedBy[0].toLowerCase();
      const lastName = room.requestedBy.split(' ')[1].toLowerCase();
      room.reqNetId = `${firstInitial}${lastName}`;
      // random date between now and 2 weeks from now
      room.requestedOnDate = new Date(Date.now() + Math.floor(Math.random() * 12096e5));
    }
  };

  const fetchReservations = async () => {
    // const location = (isDev) ? 'realInventoryTestData.json' : 'db';
    // const location = 'api/v1/device-res';
    const roomResLocation = `${API}/room-res`;
    const testDataLocation = 'realRoomTestData.json';
    if (isDev) {
      // simulate a fetch delay
      await sleep(1000);
    }
    try {
      // Check if /api is accessible
      const useApi = await apiAccessible();
      const selectedLocation = (useApi) ? roomResLocation : testDataLocation;

      // Fetch room reservations
      const response = await fetch(selectedLocation);
      const json = await response.json();

      setReservations(json);
    } catch (err) {
      console.error(err);
    }
  };

  const setRequest = (id, to) => {
    for (const reservation of roomReservations.value) {
      if (reservation.id === id) {
        reservation.approved = to;
        // remove the request from the list
        roomReservations.value = roomReservations.value.filter(
          (res) => res.building !== reservation.building
          || res.room !== reservation.room
          || res.date !== reservation.date
          || res.time !== reservation.time,
        );
      }
    }
  };

  const approveRequest = (id) => {
    setRequest(id, true);
  };

  const denyRequest = (id) => {
    setRequest(id, false);
  };

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
  };
});
