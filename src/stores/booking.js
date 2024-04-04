import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/booking-complex';
const COMPLEX_URL = 'http://localhost:8000/book-charger-complex';

export const useBookingStore = defineStore('booking', () => {
  // Define the state and actions
  const state = () => ({
    data: null,
    responseCreateBooking: null, // Initialize responseData property
  });

  const actions = {
    setData(payload) {
      console.log(payload);
      this.data = payload;
      this.createBooking(this.data);
    },
  };

  // User Bookings in the area
  const bookingList = ref([]);
  const chargerBookingList = ref([]);

  async function createBooking(data) {
    try {
      const response = await axios.post(
        'http://localhost:8000/book-charger-complex/book-charger',
        data
      );
      console.log('Response:', response.data);
      this.responseData = response.data; // Update responseData in store
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error to handle it elsewhere if needed
    }
  }
  async function fetchChargerBookings(chargerID) {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:8000/charging-station-booking/charger/${chargerID}`,
      };
      const response = await axios(config);
      const userBookings = response?.data;
      chargerBookingList.value = userBookings || [];
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
  }

  async function fetchAllBookingsUser(userId) {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/user/${userId}`,
      };
      const response = await axios(config);
      const userBookings = response?.data;
      bookingList.value = userBookings || [];
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
  }

  async function endBooking(bookingId, userId) {
    try {
      const config = {
        method: 'post',
        url: `${COMPLEX_URL}/complete-booking`,
        data: {
          booking_id: bookingId,
          // user_id: userId,
        },
      };
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Error ending booking:', error);
      throw error;
    }
  }

  async function cancelBooking(bookingId, userId) {
    try {
      const config = {
        method: 'post',
        url: `${COMPLEX_URL}/cancel-booking`,
        data: {
          booking_id: bookingId,
          // user_id: userId,
        },
      };
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Error ending booking:', error);
      throw error;
    }
  }

  return {
    bookingList,
    chargerBookingList,
    fetchAllBookingsUser,
    endBooking,
    cancelBooking,
    fetchChargerBookings,
    createBooking,
    ...state(),
    ...actions,
  };
});
