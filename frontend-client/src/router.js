import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import InventoryList from '@/views/InventoryList.vue';

const routes = [{
  path: '/',
  name: 'Home',
  component: Home,
}, {
  path: '/inventory',
  name: 'Inventory',
  component: InventoryList,
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
