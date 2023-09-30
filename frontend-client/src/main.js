import '@/assets/main.css';
import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import router from '@/router';
import App from '@/App.vue';

createApp(App)
  .use(router)
  .use(PrimeVue)
  .mount('#app');
