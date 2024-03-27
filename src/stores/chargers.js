import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useChargersStore = defineStore('chargers', () => {
  // Chargers in the area
  const chargerslist = ref([])

  async function fetchAllStations() {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:5001/charging-station/chargers`,
      };
      const response = await axios(config);
      const nearbyStations = response?.data?.chargers;
      chargerslist.value = nearbyStations || [];
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
          "lat": lat,
          "lon": lon,
          "radius": radius,
          "booking_time": bookingTime,
          "booking_duration": bookingDuration,
          "booking_date": bookingDate,
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
    chargerslist,
    fetchNearbyStations,
    fetchAllStations
  }
})
