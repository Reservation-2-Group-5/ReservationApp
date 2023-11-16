import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { BASE_API, fixDate } from '@/utils/APIUtils';

const API = `${BASE_API}/devices`;

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
    newItem.startDate = fixDate(item.Start_Date);
    newItem.endDate = fixDate(item.End_Date);
    // eslint-disable-next-line no-nested-ternary
    newItem.available = (item.Available) ? 'available'
      : (newItem.netId) ? 'unavailable' : 'pending';

    formattedData.push(newItem);
  }
  return formattedData;
};

const useInventoryStore = defineStore('inventory', () => {
  const inventory = ref([]);

  const setInventory = (newInventory) => {
    inventory.value = formatInventoryData(newInventory);
  };

  const fetchInventory = async () => {
    try {
      // Check if /api is accessible
      // const useApi = await apiAccessible();
      // console.log('useApi', useApi);
      // if (!useApi) return; // don't fetch if api is not accessible

      // Fetch device reservations
      const response = await fetch(API);
      console.log('devices response', response);
      const json = await response.json();
      console.log('devices json', json);
      setInventory(json);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAll = async () => {
    await fetchInventory();
  };

  const getAll = computed(() => inventory.value);

  return {
    inventory,
    setInventory,
    fetchInventory,
    fetchAll,
    getAll,
  };
});

export default useInventoryStore;
