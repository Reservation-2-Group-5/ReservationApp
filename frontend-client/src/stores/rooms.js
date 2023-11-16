import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { BASE_API, fixDate } from '@/utils/APIUtils';

const API = `${BASE_API}/rooms`;

const formatRoomData = (data) => {
  const formattedData = [];
  for (const room of data) {
    const newRoom = {};
    newRoom.building = room.Building;
    newRoom.room = room.RoomNumber;
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

const useRoomStore = defineStore('rooms', () => {
  const rooms = ref([]);

  const setRooms = (newRooms) => {
    rooms.value = formatRoomData(newRooms);
  };

  const fetchRooms = async () => {
    try {
      // Check if /api is accessible
      // const useApi = await apiAccessible();
      // if (!useApi) return; // don't fetch if api is not accessible

      // Fetch device reservations
      const response = await fetch(API);
      console.log('rooms response', response);
      const json = await response.json();
      console.log('rooms json', json);
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

export default useRoomStore;
