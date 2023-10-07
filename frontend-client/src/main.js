import '@/assets/main.css';
import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import router from '@/router';
import App from '@/App.vue';
import { useUserStore } from '@/store';

createApp(App)
  .use(router)
  .use(createPinia())
  .use(PrimeVue)
  .use(ToastService)
  .mount('#app');

// TODO: Remove this once we have a login page
const userStore = useUserStore();
userStore.setUser({
  id: 1,
  name: 'John Doe',
  role: 'admin',
});
