import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { isDev } from '@/utils/env';
import sleep from '@/utils/sleep';

const formatData = (data) => {
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
    formattedData.push(newItem);
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
    inventory.value = formatData(newInventory);
    for (const item of inventory.value) {
      // item.img = item.img ?? '';
      if (item.warrantyExpiration && typeof item.warrantyExpiration === 'string') {
        item.warrantyExpiration = new Date(item.warrantyExpiration);
      }
    }
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
    reservations.value = formatData(newReservations);
    for (const item of reservations.value) {
      // item.img = item.img ?? '';
      if (item.warrantyExpiration && typeof item.warrantyExpiration === 'string') {
        item.warrantyExpiration = new Date(item.warrantyExpiration);
      }

      // TODO: Remove with real data
      // Add reservation data to devices
      item.requestedBy = `${
        ['John', 'Jane', 'Joe', 'Jill', 'Jack'][Math.floor(Math.random() * 5)]
      } ${
        ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 5)]
      }`;
      // random date between now and 2 weeks from now
      item.requestedDate = new Date(Date.now() + Math.floor(Math.random() * 12096e5));
      // incrementing id
      item.id = reservations.value.indexOf(item) + 1;
      if (item.requestedDate && typeof item.requestedDate === 'string') {
        item.requestedDate = new Date(item.requestedDate);
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

  const approveReservation = (id) => {
    for (const reservation of reservations.value) {
      if (reservation.id === id) {
        reservation.approved = true;
        // remove the reservation from the list
        reservations.value = reservations.value.filter((res) => res.id !== id);
      }
    }
  };

  const denyReservation = (id) => {
    for (const reservation of reservations.value) {
      if (reservation.id === id) {
        reservation.approved = false;
        // remove the reservation from the list
        reservations.value = reservations.value.filter((res) => res.id !== id);
      }
    }
  };

  const fetchAll = async () => {
    await fetchReservations();
  };

  const getAll = computed(() => reservations.value);

  return {
    reservations,
    setReservations,
    fetchReservations,
    approveReservation,
    denyReservation,
    fetchAll,
    getAll,
  };
});
