<script setup>
import { reactive, onMounted, computed, ref } from 'vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { useBookingStore } from '@/stores/booking';
import { useLoginStore } from '@/stores/login';
const bookingStore = useBookingStore();
const loginStore = useLoginStore();
onMounted(() => {
  fetchAllBookingsUser();
});
// COMPUTED
// const bookingList = computed(() => bookingStore.bookingList)
// const sortedBookings = computed(() => {
//   const inProgressBookings = [];
//   const upcomingBookings = [];

//   // Separate bookings into two arrays based on status
//   for (const booking of bookingStore.bookingList) {
//     if (
//       getBookingStatus(
//         booking.booking_datetime,
//         booking.booking_duration_hours
//       ) == 'In Progress'
//     ) {
//       inProgressBookings.push(booking);
//     } else {
//       upcomingBookings.push(booking);
//     }
//   }

//   // Combine arrays with in progress bookings first
//   return [...inProgressBookings, ...upcomingBookings];
// });

const inProgressBookings = computed(() => {
  return bookingStore.bookingList.filter((booking) => {
    return (
      getBookingStatus(
        booking.booking_datetime,
        booking.booking_duration_hours
      ) === 'In Progress'
    );
  });
});

const upcomingBookings = computed(() => {
  return bookingStore.bookingList.filter((booking) => {
    return (
      getBookingStatus(
        booking.booking_datetime,
        booking.booking_duration_hours
      ) !== 'In Progress'
    );
  });
});

// Functions
async function fetchAllBookingsUser() {
  try {
    await bookingStore.fetchAllBookingsUser(loginStore.userId);
    console.log(bookingStore.bookingList);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
  }
}
// Helper function to format booking datetime
function formatDate(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  return `${dateTime.toLocaleDateString()} ${padZero(
    dateTime.getHours()
  )}:${padZero(dateTime.getMinutes())}`;
}

// Helper function to calculate end time based on booking duration
function formatEndTime(dateTimeString, duration) {
  const dateTime = new Date(dateTimeString);
  dateTime.setHours(dateTime.getHours() + duration);
  return `${dateTime.toLocaleDateString()} ${padZero(
    dateTime.getHours()
  )}:${padZero(dateTime.getMinutes())}`;
}
// Helper function to pad single digits with leading zeros
function padZero(num) {
  return num.toString().padStart(2, '0');
}

// Helper function to calculate remaining time
function calculateRemainingTime(dateTimeString, duration) {
  const currentTime = new Date();
  const bookingTime = new Date(dateTimeString);
  bookingTime.setHours(bookingTime.getHours() + duration);

  const remainingTimeMilliseconds = bookingTime - currentTime;
  const remainingMinutes = Math.ceil(remainingTimeMilliseconds / (1000 * 60));
  if (remainingMinutes >= 24 * 60) {
    const remainingDays = Math.floor(remainingMinutes / (24 * 60));
    return `${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
  } else if (remainingMinutes >= 60) {
    const remainingHours = Math.floor(remainingMinutes / 60);
    return `${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
  } else {
    return `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  }
}

function calculateToBookingTime(dateTimeString) {
  const currentTime = new Date();
  const bookingTime = new Date(dateTimeString);
  bookingTime.setHours(bookingTime.getHours());

  const remainingTimeMilliseconds = bookingTime - currentTime;
  const remainingMinutes = Math.ceil(remainingTimeMilliseconds / (1000 * 60));
  if (remainingMinutes >= 24 * 60) {
    const remainingDays = Math.floor(remainingMinutes / (24 * 60));
    return `${remainingDays} day${remainingDays !== 1 ? 's' : ''} to booking`;
  } else if (remainingMinutes >= 60) {
    const remainingHours = Math.floor(remainingMinutes / 60);
    return `${remainingHours} hour${
      remainingHours !== 1 ? 's' : ''
    } to booking`;
  } else {
    return `${remainingMinutes} minute${
      remainingMinutes !== 1 ? 's' : ''
    } to booking`;
  }
}

function getBookingStatus(dateTimeString, duration) {
  const currentTime = new Date();
  const bookingTime = new Date(dateTimeString);
  const endTime = new Date(bookingTime.getTime() + duration * 60 * 60 * 1000);

  console.log('hi', bookingTime);

  if (currentTime < bookingTime) {
    console.log('upcming', bookingTime);

    return 'Upcoming';
  } else if (currentTime >= bookingTime && currentTime <= endTime) {
    console.log('in progrewss', bookingTime);

    return 'In Progress';
  } else {
    return 'Completed';
  }
}

async function cancelBooking(booking_id) {
  try {
    let result = await bookingStore.cancelBooking(
      booking_id,
      loginStore.userId
    );
    console.log(result);
    fetchAllBookingsUser();
  } catch (error) {
    console.error('Error fetching user bookings:', error);
  }
}
async function endBooking(booking_id) {
  try {
    let result = await bookingStore.endBooking(booking_id, loginStore.userId);
    console.log(result);
    fetchAllBookingsUser();
  } catch (error) {
    console.error('Error fetching user bookings:', error);
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <BaseButton to="/dashboard" color="info" class="ml-6 mt-4" label="Back" />
    <div>
      <div class="stat">
        <div class="stat-title">MY BOOKINGS</div>
        <div class="stat-value text-accent">ONGOING</div>
        <!-- <div class="stat-desc text-secondary">↗︎ 40 (2%)</div> -->
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-5">
        <p class="ml-2" v-if="inProgressBookings.length === 0">
          No ongoing bookings.
        </p>
        <template v-else>
          <template
            v-for="booking in inProgressBookings"
            :key="booking.booking_id"
          >
            <div
              v-if="
                getBookingStatus(
                  booking.booking_datetime,
                  booking.booking_duration_hours
                ) == 'In Progress' && booking.booking_status == 'IN_PROGRESS'
              "
              class="card bg-base-100"
            >
              <figure>
                <img
                  :src="
                    'http://localhost:5001/charging-station/images/' +
                    booking.charger_info?.charger_image
                  "
                />
              </figure>
              <div class="card-body">
                <div class="flex justify-between items-baseline">
                  <span class="text-slate-400 text-xs"
                    >Booking ends in
                    {{
                      calculateRemainingTime(
                        booking.booking_datetime,
                        booking.booking_duration_hours
                      )
                    }}</span
                  >
                  <span>{{
                    booking.charger_info.charging_status == 'Not Charging'
                      ? '~'
                      : '⚡' + booking.charger_info.charging_status + '%'
                  }}</span>
                </div>
                <progress
                  v-if="booking.charger_info.charging_status != 'Not Charging'"
                  class="progress h-3 progress-accent w-100"
                  :value="booking.charger_info.charging_status"
                  max="100"
                ></progress>
                <progress
                  v-else
                  class="progress h-3 w-100"
                  max="100"
                ></progress>
                <div class="flex justify-between align-middle">
                  <h2 class="card-title text-black">
                    {{ booking.charger_info.charger_name }}
                  </h2>
                </div>
                <span class="text-slate-400">{{
                  booking.charger_info.charger_location
                }}</span>
                <span class="text-slate-400"
                  >Booked From: {{ formatDate(booking.booking_datetime) }}-{{
                    formatEndTime(
                      booking.booking_datetime,
                      booking.booking_duration_hours
                    )
                  }}</span
                >
                <div class="card-actions mt-5">
                  <button
                    class="btn btn-primary btn-outline w-full"
                    @click="endBooking(booking.booking_id)"
                  >
                    END CHARGING
                  </button>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
      <div class="stat mt-10">
        <div class="stat-title">MY BOOKINGS</div>
        <div class="stat-value text-primary">UPCOMING</div>
        <!-- <div class="stat-desc text-secondary">↗︎ 40 (2%)</div> -->
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 px-5">
        <p class="ml-2" v-if="upcomingBookings.length === 0">
          No upcoming bookings.
        </p>
        <template v-else>
          <template
            v-for="booking in upcomingBookings"
            :key="booking.booking_id"
          >
            <div
              v-if="
                getBookingStatus(
                  booking.booking_datetime,
                  booking.booking_duration_hours
                ) == 'Upcoming' && booking.booking_status == 'IN_PROGRESS'
              "
              class="card bg-base-100"
            >
              <figure>
                <img
                  :src="
                    'http://localhost:5001/charging-station/images/' +
                    booking.charger_info.charger_image
                  "
                />
              </figure>
              <div class="card-body">
                <div class="flex justify-between items-baseline">
                  <span class="text-slate-400 text-xs">{{
                    calculateToBookingTime(booking.booking_datetime)
                  }}</span>
                  <span>~</span>
                </div>
                <progress class="progress h-3 w-100" max="100"></progress>
                <div class="flex justify-between align-middle">
                  <h2 class="card-title text-black">
                    {{ booking.charger_info.charger_name }}
                  </h2>
                </div>
                <span class="text-slate-400">{{
                  booking.charger_info.charger_location
                }}</span>
                <span class="text-slate-400"
                  >Booked From: {{ formatDate(booking.booking_datetime) }}-{{
                    formatEndTime(
                      booking.booking_datetime,
                      booking.booking_duration_hours
                    )
                  }}</span
                >
                <div class="card-actions mt-5">
                  <button
                    class="btn btn-primary btn-outline w-full"
                    @click="cancelBooking(booking.booking_id)"
                  >
                    CANCEL BOOKING
                  </button>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </LayoutAuthenticated>
</template>
