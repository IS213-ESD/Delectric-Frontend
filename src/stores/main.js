import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useMainStore = defineStore('main', () => {
  const userName = ref('John Doe')
  const userEmail = ref('doe.doe.doe@example.com')

  const userAvatar = computed(
    () =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail.value.replace(
        /[^a-z0-9]+/gi,
        '-'
      )}`
  )

  const isFieldFocusRegistered = ref(false)

  const clients = ref([])
  const history = ref([])

  // Chargers in the area
  const chargerslist = ref([])

  function setUser(payload) {
    if (payload.name) {
      userName.value = payload.name
    }
    if (payload.email) {
      userEmail.value = payload.email
    }
  }

  function fetchSampleClients() {
    axios
      .get(`data-sources/clients.json?v=3`)
      .then((result) => {
        clients.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  async function fetchAllStations() {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:5001/charging-station/chargers`,
      };
      const response = await axios(config);
      const nearbyStations = response?.data?.data?.nearby_stations;
      chargerslist.value = nearbyStations || [];
      console.log(chargerslist.value)
    } catch (error) {
      console.error('Error fetching nearby stations:', error);
      // Handle error gracefully, e.g., show a message to the user
    }
  }

  async function fetchNearbyStations(lat, lon, radius, bookingTime, bookingDuration, bookingDate) {
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
        }
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
    fetchAllStations
  }
})
