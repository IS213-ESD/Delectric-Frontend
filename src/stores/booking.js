import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useBookingStore = defineStore('booking', () => {
  // Chargers in the area
  const bookingList = ref([]);

  async function fetchChargerBookings() {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:5001/charging-station-booking/charger/1`,
      };
      const response = await axios(config);
      const userBookings = response?.data;
      bookingList.value = userBookings || [];
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
  }

  async function fetchAllBookingsUser() {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:5011/booking-complex/user/1`,
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
        url: 'http://localhost:5011/booking-complex/endbooking',
        data: {
          booking_id: bookingId,
          user_id: userId,
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
        url: 'http://localhost:5011/booking-complex/cancelbooking',
        data: {
          booking_id: bookingId,
          user_id: userId,
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
    fetchAllBookingsUser,
    endBooking,
    cancelBooking,
    fetchChargerBookings,
  };
});
