import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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
  };
});
