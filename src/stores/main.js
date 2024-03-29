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
  const radius = ref('100');
  const hrs = ref(27);
  const bookingDate = ref('2024-03-08');
  const center = ref({ lat: 1, lng: 2 });

  const userAvatar = computed(
    () =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail.value.replace(
        /[^a-z0-9]+/gi,
        '-'
      )}`
  );

  // get current location using Google Maps API navigator
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Set the center to the user's current location
      center.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // console.log('Shawn is here', center.value);

      // updateStoreLocation(center.value.lat, center.value.lng);
      latitude.value = position.coords.latitude;
      longitude.value = position.coords.longitude;
    },
    (error) => {
      console.error('Error getting current location:', error);
    }
  );

  const isFieldFocusRegistered = ref(false);

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

  function setUser(payload) {
    if (payload.name) {
      userName.value = payload.name;
    }
    if (payload.email) {
      userEmail.value = payload.email;
    }
  }

  return {
    userName,
    userEmail,
    userAvatar,
    isFieldFocusRegistered,
    setUser,
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
    center,
  };
});
