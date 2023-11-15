import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const API = 'api/v1';

// const apiAccessible = async () => {
//   const apiLocation = '/api';
//   const apiResponse = await fetch(apiLocation, { method: 'HEAD' });
//   return apiResponse.status === 200;
// };

const fixDate = (date) => {
  if (date && (typeof date === 'string' || typeof date === 'number')) {
    return new Date(date);
  }
  return date;
};

const formatUserData = (data) => {
  const formattedData = [];
  for (const user of data) {
    const newUser = {};
    newUser.netId = user.NetID;
    newUser.name = user.Name;
    newUser.email = user.Email;
    newUser.isFaculty = user.Is_Faculty;
    newUser.isStudent = user.Is_Student;
    newUser.isAdmin = user.Is_Admin;

    formattedData.push(newUser);
  }
  return formattedData;
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

export const useUserStore = defineStore('user', () => {
  const users = ref([]);
  const user = ref(null);

  const setUser = (newUser) => {
    user.value = newUser;
  };

  const setUsers = (newUsers) => {
    users.value = formatUserData(newUsers);
  };

  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.isAdmin);

  async function fetchUsers() {
    try {
      // Check if /api is accessible
      // const useApi = await apiAccessible();
      // // console.log('useApi', useApi);
      // if (!useApi) return; // don't fetch if api is not accessible

      const response = await fetch(`${API}/users`);
      console.log('users response', response);
      if (response.status === 500) {
        throw new Error('Error fetching users');
      }
      const json = await response.json();
      console.log('users json', json);
      setUsers(json);
    } catch (err) {
      throw new Error(err);
    }
  }

  // TODO: implement once we have netid system
  async function login() {
    if (user.value) return; // don't login if already logged in
    if (!users.value.length) {
      await fetchUsers();
    }
    // FIXME: pick a random user with admin role for now
    const adminUsers = users.value.filter((u) => u.isAdmin);
    const randomAdmin = adminUsers[Math.floor(Math.random() * adminUsers.length)];
    setUser(randomAdmin);
  }

  return {
    user,
    setUser,
    isLoggedIn,
    isAdmin,
    login,
  };
});

export const useInventoryStore = defineStore('inventory', () => {
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
      const response = await fetch(`${API}/devices`);
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

export const useDeviceReservationStore = defineStore('deviceReservation', () => {
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
      const response = await fetch(`${API}/device-res`);
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
    const response = await fetch(`${API}/device-res/${res.id}`, {
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
    const response = await fetch(`${API}/device-res`, {
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

export const useRoomStore = defineStore('rooms', () => {
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
      const response = await fetch(`${API}/rooms`);
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

export const useRoomReservationStore = defineStore('roomReservation', () => {
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
      const response = await fetch(`${API}/room-res`);
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
    const response = await fetch(`${API}/room-res/${resArr[0].id}`, {
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
    const response = await fetch(`${API}/room-res`, {
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
