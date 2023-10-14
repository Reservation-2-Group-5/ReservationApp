import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { isDev } from '@/utils/env';
import sleep from '@/utils/sleep';

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
    inventory.value = newInventory;
    for (const item of inventory.value) {
      item.img = item.img ?? '';
      if (item.startDate && typeof item.startDate === 'string') {
        item.startDate = new Date(item.startDate);
      }
      if (item.endDate && typeof item.endDate === 'string') {
        item.endDate = new Date(item.endDate);
      }
    }
  };

  const fetchInventory = async () => {
    const location = (isDev) ? 'testData.json' : 'db';
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

  return {
    inventory,
    setInventory,
    setItemImg,
    fetchInventory,
  };
});

export const useReservationStore = defineStore('reservation', () => {
  const reservations = ref([]);

  const setReservations = (newReservations) => {
    reservations.value = newReservations;
  };

  const fetchReservations = async () => {
    const location = (isDev) ? 'testData.json' : 'db';
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

  return {
    reservations,
    setReservations,
    fetchReservations,
    approveReservation,
    denyReservation,
  };
});
