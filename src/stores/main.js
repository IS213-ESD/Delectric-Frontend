import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useMainStore = defineStore('main', () => {
  const userName = ref('John Doe');
  const userEmail = ref('doe.doe.doe@example.com');
  // const storeLocation = ref({}); // Initialize with default values
  const bookingFilter = ref({});
  const latitude = ref(0);
  const longitude = ref(0);
  const currentTimeString = ref('');
  const radius = ref('1.5');
  const hrs = ref(27);
  const bookingDate = ref('2024-03-08');

  const userAvatar = computed(
    () =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail.value.replace(
        /[^a-z0-9]+/gi,
        '-'
      )}`
  );

  const isFieldFocusRegistered = ref(false);

  const clients = ref([]);
  const history = ref([]);

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  const receiveBookingFilter = (date, hrsBooked) => {
    bookingFilter.value = { date, hrsBooked };
    hrs.value = hrsBooked;
    const modifyDate = new Date(date);

    const year = date.getFullYear();
    const month = String(modifyDate.getMonth() + 1).padStart(2, '0');
    const day = String(modifyDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    bookingDate.value = formattedDate;
  };

  const storeLocation = computed(() => ({
    latitude: latitude.value,
    longitude: longitude.value,
    radius: radius.value,
    currentTimeString: currentTimeString.value,
    hrs: hrs.value,
    date: bookingDate.value,
  }));

  // Function to update store location
  const updateStoreLocation = (lat, lon) => {
    latitude.value = lat;
    longitude.value = lon;
    currentTimeString.value = getCurrentTime();
    // You can update radius, hrs, and date here if they change dynamically
  };

  // Chargers in the area
  const chargerslist = ref([]);

  function setUser(payload) {
    if (payload.name) {
      userName.value = payload.name;
    }
    if (payload.email) {
      userEmail.value = payload.email;
    }
  }

  function fetchSampleClients() {
    axios
      .get(`data-sources/clients.json?v=3`)
      .then((result) => {
        clients.value = result?.data?.data;
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data?.data;
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  async function fetchAllStations() {
    try {
      const response = await axios.get(
        'http://localhost:5001/charging-station/chargers'
      );
      const nearbyStations = response?.data?.chargers;
      chargerslist.value = nearbyStations || [];
    } catch (error) {
      console.error('Error fetching nearby stations:', error);
      // Handle error gracefully, e.g., show a message to the user
    }
  }

  async function fetchNearbyStations(
    lat,
    lon,
    radius,
    bookingTime,
    bookingDuration,
    bookingDate
  ) {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:5001/charging-station/nearby_stations_booking`,
        params: {
          lat,
          lon,
          radius,
          booking_time: bookingTime,
          booking_duration: bookingDuration,
          booking_date: bookingDate,
        },
      };
      const response = await axios(config);
      const nearbyStations = response?.data?.data?.nearby_stations;
      chargerslist.value = nearbyStations || [];
    } catch (error) {
      console.error('Error fetching nearby stations:', error);
      // Handle error gracefully, e.g., show a message to the user
    }
  }

  return {
    userName,
    userEmail,
    userAvatar,
    isFieldFocusRegistered,
    clients,
    history,
    chargerslist,
    setUser,
    fetchSampleClients,
    fetchSampleHistory,
    fetchNearbyStations,
    fetchAllStations,
    updateStoreLocation,
    storeLocation,
    receiveBookingFilter,
    bookingFilter,
    latitude,
    longitude,
    currentTimeString,
    radius,
    hrs,
    bookingDate,
  };
});
