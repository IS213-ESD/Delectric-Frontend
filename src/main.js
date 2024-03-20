import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useMainStore } from '@/stores/main.js';
import VueGoogleMaps from '@fawmi/vue-google-maps';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import './css/main.css';

// Init Pinia
const pinia = createPinia();

// Get API from

// const mapsApi = import.meta.env.VITE_API_KEY;
// console.log(mapsApi);

// Create Vue app
createApp(App)
  .use(router)
  .use(pinia)
  .use(VueDatePicker)
  .use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyDK3bNzaTJQur2o-1H1a709cdQS4gwzQy0', // Add your Google Maps API key here
      libraries: 'places', // Add any additional libraries if needed
    },
  })
  .mount('#app');

// Init main store
const mainStore = useMainStore(pinia);

// Fetch sample data
mainStore.fetchSampleClients();
mainStore.fetchSampleHistory();

// Dark mode
// Uncomment, if you'd like to restore persisted darkMode setting, or use `prefers-color-scheme: dark`. Make sure to uncomment localStorage block in src/stores/darkMode.js
import { useDarkModeStore } from './stores/darkMode';

const darkModeStore = useDarkModeStore(pinia);

if (
  (!localStorage['darkMode'] &&
    window.matchMedia('(prefers-color-scheme: dark)').matches) ||
  localStorage['darkMode'] === '1'
) {
  darkModeStore.set(true);
}

// Default title tag
const defaultDocumentTitle = 'Delectric';

// Set document title from route meta
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});
