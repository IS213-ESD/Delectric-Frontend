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
const sortedBookings = computed(() => {
  const inProgressBookings = [];
  const upcomingBookings = [];

  // Separate bookings into two arrays based on status
  for (const booking of bookingStore.bookingList) {
    if (
      getBookingStatus(
        booking.booking_datetime,
        booking.booking_duration_hours
      ) == 'In Progress'
    ) {
      inProgressBookings.push(booking);
    } else {
      upcomingBookings.push(booking);
    }
  }

  // Combine arrays with in progress bookings first
  return [...inProgressBookings, ...upcomingBookings];
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

  if (currentTime < bookingTime) {
    return 'Upcoming';
  } else if (currentTime >= bookingTime && currentTime <= endTime) {
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
    <div>
      <div class="stat">
        <div class="stat-title">MY BOOKINGS</div>
        <div class="stat-value text-neutral-content">Past Activity</div>
      </div>
      <div class="mx-4">
        <p class="ml-2" v-if="sortedBookings.length === 0">
          No completed bookings.
        </p>

        <div class="overflow-x-auto">
          <table class="table-auto">
            <!-- head -->
            <thead>
              <tr>
                <th class="text-white">Charger Name</th>
                <th class="text-white">Location</th>
                <th class="text-white">Booking DateTime</th>
                <th class="text-white">Status</th>
                <th class="text-white">Booking Fee</th>
                <th class="text-white">Charging Fee</th>
              </tr>
            </thead>

            <tbody class="bg-slate-300">
              <!-- Replace this section with the provided template -->
              <template v-if="sortedBookings && sortedBookings.length">
                <template
                  v-for="booking in sortedBookings"
                  :key="booking.booking_id"
                >
                  <tr
                    v-if="
                      booking.booking_status === 'CANCELLED' ||
                      booking.booking_status === 'COMPLETED'
                    "
                  >
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="avatar">
                          <div class="mask mask-squircle w-12 h-12">
                            <img
                              :src="
                                'http://localhost:5001/charging-station/images/' +
                                booking.charger_info.charger_image
                              "
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>
                        <div>
                          <div class="font-bold text-black">
                            {{ booking.charger_info.charger_name }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="text-black">
                      {{ booking.charger_info.charger_location }}
                    </td>
                    <td>
                      <span class="text-black">
                        {{ formatDate(booking.booking_datetime) }}-{{
                          formatEndTime(
                            booking.booking_datetime,
                            booking.booking_duration_hours
                          )
                        }}</span
                      >
                    </td>
                    <td>
                      <button class="btn btn-ghost btn-xs text-black">
                        {{ booking.booking_status }}
                      </button>
                    </td>
                    <td class="text-black">
                      ${{
                        booking.booking_status == 'CANCELLED'
                          ? 0
                          : booking.booking_fee
                      }}
                    </td>
                    <td class="text-black">${{ booking.charging_fee }}</td>
                  </tr>
                </template>
              </template>
              <!-- End of replaced section -->
            </tbody>
            <!-- foot -->
          </table>
        </div>
      </div>
    </div>
  </LayoutAuthenticated>
</template>
