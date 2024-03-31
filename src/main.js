import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useMainStore } from '@/stores/main.js';
import { useChargersStore } from '@/stores/chargers.js';
import { useBookingStore } from '@/stores/booking.js';
import { useLoginStore } from '@/stores/login.js';
import { useSignupStore } from '@/stores/signup.js';
import VueGoogleMaps from '@fawmi/vue-google-maps';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import './css/main.css';

// Init Pinia
const pinia = createPinia();

// Get API from
// Create Vue app
createApp(App)
  .use(router)
  .use(pinia)
  .use(VueDatePicker)
  .use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyA-R-V5D-Di4Y4NcmW-DFt0Aez9AOxj5X0', // Add your Google Maps API key here
      libraries: 'places', // Add any additional libraries if needed
    },
  })
  .mount('#app');

// Init main store
useMainStore(pinia);
useChargersStore(pinia);
useBookingStore(pinia);
useLoginStore(pinia);
useSignupStore(pinia);

// Dark mode
// Uncomment, if you'd like to restore persisted darkMode setting, or use `prefers-color-scheme: dark`. Make sure to uncomment localStorage block in src/stores/darkMode.js
import { useDarkModeStore } from './stores/darkMode';

// Handle dark mode
const initializeDarkMode = () => {
  const darkModeStore = useDarkModeStore(pinia);
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedDarkMode = localStorage.getItem('darkMode') === '1';
  darkModeStore.set(prefersDarkMode || storedDarkMode);
};

initializeDarkMode();

// Set document title from route meta
const setDocumentTitle = (to) => {
  const defaultDocumentTitle = 'Delectric';
  document.title = to.meta?.title ? `${to.meta.title} — ${defaultDocumentTitle}` : defaultDocumentTitle;
};

router.afterEach(setDocumentTitle);

const redirectToLoginPage = () => {
  const loginStore = useLoginStore();
  console.log("[USER ID]", loginStore.userId)
  if (!loginStore.userId) {
    router.push('/login');
  }else{
    loginStore.getuserdetails()
  }
};
redirectToLoginPage();
