import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { BASE_API } from '@/utils/APIUtils';

const API = `${BASE_API}/users`;

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

const useUserStore = defineStore('user', () => {
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
    // Check if /api is accessible
    // const useApi = await apiAccessible();
    // // console.log('useApi', useApi);
    // if (!useApi) return; // don't fetch if api is not accessible

    const response = await fetch(API);
    console.log('users response', response);
    if (response.status === 500) {
      throw new Error('Error fetching users');
    }
    const json = await response.json();
    console.log('users json', json);
    setUsers(json);
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

export default useUserStore;
