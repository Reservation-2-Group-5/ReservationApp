import { createRouter, createWebHistory } from 'vue-router';
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
}];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.name) {
    next({
      name: 'Home',
    });
  } else {
    next();
  }
});

export default router;
