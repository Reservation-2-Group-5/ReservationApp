import '@/assets/reset.css';
import '@/assets/main.css';
import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primeicons/primeicons.css';
import 'vue-toastification/dist/index.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import Toast from 'vue-toastification';
import router from '@/router';
import App from '@/App.vue';

const toastOptions = {
  position: 'top-center',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__fade',
  toastClassName: 'toast',
};

createApp(App)
  .use(router)
  .use(createPinia())
  .use(PrimeVue)
  .directive('tooltip', Tooltip)
  .use(Toast, toastOptions)
  .mount('#app');
