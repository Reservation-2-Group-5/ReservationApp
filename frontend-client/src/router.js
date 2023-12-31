import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store';
import Home from '@/views/Home.vue';
import InventoryList from '@/views/InventoryList.vue';
import RoomsList from '@/views/RoomsList.vue';
import AdminPanel from '@/views/AdminPanel.vue';
import LoginPage from '@/views/LoginPage.vue';
import LogoutPage from '@/views/LogoutPage.vue';

const routes = [{
  path: '/',
  name: 'Home',
  component: Home,
}, {
  path: '/inventory',
  name: 'Inventory',
  component: InventoryList,
  meta: {
    requiresAuth: true,
  },
}, {
  path: '/rooms',
  name: 'Rooms',
  component: RoomsList,
  meta: {
    requiresAuth: true,
  },
}, {
  path: '/login',
  name: 'Login',
  component: LoginPage,
}, {
  path: '/admin',
  name: 'Admin',
  component: AdminPanel,
  meta: {
    requiresAuth: true,
    requiresAdmin: true,
  },
}, {
  path: '/logout',
  name: 'Logout',
  component: LogoutPage,
  meta: {
    requiresAuth: true,
  },
}];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (!to.name) {
    return {
      name: 'Home',
    };
  }
  document.title = `Reservation App | ${to.name}`;
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return {
      name: 'Login',
      query: {
        redirect: to.fullPath,
      },
    };
  }
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return {
      name: 'Home',
    };
  }
  return true;
});

export default router;
