import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { isDev } from '@/utils/env';
import sleep from '@/utils/sleep';

const formatInventoryData = (data) => {
  const formattedData = [];
  for (const item of data) {
    const newItem = {};
    newItem.tag = item.Tag;
    newItem.category = item['Model Category'];
    newItem.name = item['Device Display Name'];
    newItem.assignedTo = item['Assigned To'];
    newItem.netId = item.NetID;
    newItem.location = item.Location;
    newItem.fundingSource = item['Funding Source'];
    newItem.department = item['Department Ownership'];
    newItem.serialNumber = item['Serial Number'];
    newItem.poNumber = item['PO#'];
    newItem.warrantyExpiration = item['Warranty Expiration'];
    newItem.available = (item.Available) ? 'available' : 'unavailable';
    if (newItem.warrantyExpiration && typeof newItem.warrantyExpiration === 'string') {
      newItem.warrantyExpiration = new Date(newItem.warrantyExpiration);
    }
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
    newRoom.date = room.Date;
    newRoom.time = room.Time;
    newRoom.available = (room.Available) ? 'available' : 'unavailable';
    newRoom.reservedBy = room['Reserved by (name)'];
    newRoom.reservedByNetId = room['Reserved by (netid)'];
    newRoom.maxOccupancy = room['Max occupancy'];
    newRoom.type = room['Type of room'];
    if (newRoom.date && typeof newRoom.date === 'string') {
      newRoom.date = new Date(newRoom.date);
    }
    formattedData.push(newRoom);
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
    const location = (isDev) ? 'realInventoryTestData.json' : 'db';
    if (isDev) {
      // simulate a fetch delay
      await sleep(1000);
    }
    try {
      const response = await fetch(location);
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

export const useReservationStore = defineStore('reservation', () => {
  const reservations = ref([]);

  const setReservations = (newReservations) => {
    reservations.value = formatInventoryData(newReservations);
    let id = 0;
    for (const item of reservations.value) {
      // item.img = item.img ?? '';
      if (item.warrantyExpiration && typeof item.warrantyExpiration === 'string') {
        item.warrantyExpiration = new Date(item.warrantyExpiration);
      }

      // TODO: Remove with real data
      // Add reservation data to devices - simulate db JOIN query
      item.id = id;
      id += 1;
      // random requester
      item.requestedBy = `${
        ['John', 'Jane', 'Joe', 'Jill', 'Jack'][Math.floor(Math.random() * 5)]
      } ${
        ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 5)]
      }`;
      // random date between now and 2 weeks from now
      item.requestedOnDate = new Date(Date.now() + Math.floor(Math.random() * 12096e5));
      item.requestedStartDate = new Date(item.requestedOnDate);
      item.requestedEndDate = new Date(item.requestedOnDate.getTime() + 2592e6);

      if (item.requestedOnDate && typeof item.requestedOnDate === 'string') {
        item.requestedOnDate = new Date(item.requestedOnDate);
      }
    }
  };

  const fetchReservations = async () => {
    const location = (isDev) ? 'realInventoryTestData.json' : 'db';
    if (isDev) {
      // simulate a fetch delay
      await sleep(1000);
    }
    try {
      const response = await fetch(location);
      const json = await response.json();
      setReservations(json);
    } catch (err) {
      console.error(err);
    }
  };

  const setRequest = (id, to) => {
    for (const reservation of reservations.value) {
      if (reservation.id === id) {
        reservation.approved = to;
        // remove the request from the list
        reservations.value = reservations.value.filter(
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

  const getAll = computed(() => reservations.value);

  return {
    reservations,
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
    const location = (isDev) ? 'realRoomTestData.json' : 'db';
    if (isDev) {
      // simulate a fetch delay
      await sleep(1000);
    }
    try {
      const response = await fetch(location);
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
