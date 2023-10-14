import '@/assets/main.css';
import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import router from '@/router';
import App from '@/App.vue';

createApp(App)
  .use(router)
  .use(createPinia())
  .use(PrimeVue)
  .use(ToastService)
  .mount('#app');
