import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store';
import Home from '@/views/Home.vue';
import InventoryList from '@/views/InventoryList.vue';
import AdminPanel from '@/views/AdminPanel.vue';

const routes = [{
  path: '/',
  name: 'Home',
  component: Home,
}, {
  path: '/inventory',
  name: 'Inventory',
  component: InventoryList,
}, {
  path: '/spaces',
  name: 'Spaces',
  component: null,
}, {
  path: '/login',
  name: 'Login',
  component: null,
}, {
  path: '/admin',
  name: 'Admin',
  component: AdminPanel,
  meta: {
    requiresAuth: true,
    requiresAdmin: true,
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
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.isLoggedIn.value) {
    return {
      name: 'Login',
      query: {
        redirect: to.fullPath,
      },
    };
  }
  if (to.meta.requiresAdmin && !userStore.isAdmin.value) {
    return {
      name: 'Home',
    };
  }
  return true;
});

export default router;
