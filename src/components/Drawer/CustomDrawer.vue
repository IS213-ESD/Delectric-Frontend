<template>
  <div class="drawer drawer_bottom z-50">
    <input :id="drawerId" type="checkbox" class="drawer-toggle" />

    <div class="drawer-side">
      <label
        :for="drawerId"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <div
        class="bottomDrawer bg-zinc-900 menu p-6 w-full text-base-content h-4/5 flex"
      >
        <div class="absolute bottom-0 w-full bg-slate-100 bottom-0 left-0 p-4">
          <div v-if="!hideBookButton && !hideCardBoxWidget">
            <CustomButton
              width="full"
              roundness="round"
              color="black"
              @click="onBackClick"
            >
              Book Slot
            </CustomButton>
          </div>
          <div v-if="!hideCardBoxWidget">
            <CustomButton
              width="full"
              roundness="round"
              color="green"
              @click="onBackClick"
              class="mt-2"
            >
              Back
            </CustomButton>
          </div>
          <form
            method="dialog"
            class="buttonsView flex flex-col justify-around gap-2"
            v-show="!hideButtonsView"
          >
            <CustomButton
              width="full"
              roundness="round"
              :color="disabled ? 'green' : 'disabled'"
              @click="bookSlot"
              :disabled="!disabled"
            >
              {{ buttonTrue }}
            </CustomButton>

            <CustomButton
              width="full"
              roundness="round"
              color="green"
              @click="onDrawerClose"
            >
              {{ buttonFalse }}
            </CustomButton>
          </form>
        </div>
        <!-- <form method="dialog"></form> -->

        <div class="hello overflow-auto pb-32">
          <h1 class="text-xl font-bold">Charger</h1>
          <div class="mb-12 mt-6 flex">
            <div class="flex-1 bg-slate-100 rounded-xl p-4">
              <img :src="Cutecar" />
            </div>
            <div class="flex-1 p-4">
              <h3 class="font-bold text-2xl text-black">{{ drawerTitle }}</h3>
              <p class="text-md text-black">{{ drawerSubtitle }}</p>
            </div>
          </div>

          <div v-if="!hideCardBoxWidget">
            <p class="text-md text-slate-500 mb-2">
              Select date to see available timeslots
            </p>
            <VueDatePicker
              v-model="date"
              :enable-time-picker="false"
              :model-value="date"
              @update:model-value="handleDate"
              dark
              :is-24="false"
              placeholder="Select Date & Time"
            ></VueDatePicker>

            <div class="mt-8">
              <p class="text-md text-slate-500">Click to select timeslots</p>
              <CardBoxWidget
                v-for="item in listItems"
                :key="item.id"
                trend-type="up"
                :TimeSlotStatusColor="item.color"
                :TimeSlot="item.timing"
                :distance="null"
                @click="onItemClick(item.id)"
                class="mt-2 text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from '@/components/Button/CustomButton.vue';
import { toggleDrawer } from '@/helpers/common';
import CardBoxWidget from '@/components/CardBoxWidget.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import { useBookingStore } from '@/stores/booking';
import Cutecar from '@/assets/Cutecar.png';

import { _ } from 'numeral';

export default {
  name: 'CustomDrawer',
  components: {
    CustomButton,
    CardBoxWidget,
    VueDatePicker,
  },
  data() {
    return {
      isEnabled: this.disabled,
      listItems: [{}],
      hideButtonsView: false,
      hideCardBoxWidget: false,
      hideBookButton: false,
      date: new Date(),
      bookings: [],
      createdBookings: [],
      Cutecar: Cutecar, // Assign the imported image to a variable
    };
  },
  props: {
    drawerId: {
      type: String,
      default: '',
    },
    // pageName: {
    //   type: String,
    //   default: '',
    // },
    contentHere: {
      type: String,
      default: '',
    },
    drawerTitle: {
      type: String,
      default: '',
    },
    drawerSubtitle: {
      type: String,
      default: '',
    },
    buttonFalse: {
      type: String,
      default: '',
    },
    buttonTrue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: '',
    },
  },
  mounted() {
    this.populateCalendar(this.dayBookings);
    this.hideCardBoxWidget = true;
    this.hideButtonsView = false;
    this.hideBookButton = true;
  },
  computed: {
    bookingsStore() {
      return useBookingStore();
    },
    dayBookings() {
      return this.bookings;
    },
    createdBookingList() {
      return this.createdBookings;
    },
  },
  methods: {
    handleDate(modelData) {
      this.date = modelData;
      // do something else with the data
      console.log(modelData);
      this.createdBookings = [];
      this.handleFetchDayBookings(modelData);
    },
    // Function to compare two date strings ignoring time
    areDatesEqual(dateString1, dateString2) {
      // Convert date strings to Date objects
      const date1 = new Date(dateString1);
      const date2 = new Date(dateString2);

      // Compare year, month, and day values
      const yearEqual = date1.getFullYear() === date2.getFullYear();
      const monthEqual = date1.getMonth() === date2.getMonth();
      const dayEqual = date1.getDate() === date2.getDate();

      // Return true if year, month, and day are equal, otherwise false
      return yearEqual && monthEqual && dayEqual;
    },
    convertTo24Hour(timeString) {
      let [hours, minutes] = timeString.split(/[^\d]/);
      hours = parseInt(hours);
      if (hours === 12 && timeString.toLowerCase().includes('am')) {
        hours = 0;
      } else if (timeString.toLowerCase().includes('pm')) {
        hours += 12;
      }
      return `${hours.toString().padStart(2, '0')}:${minutes.padStart(
        2,
        '0'
      )}:00`;
    },
    getHoursBooked(dateString, duration) {
      const date = new Date(dateString);
      const hours = date.getUTCHours();
      console.log(hours); // Output: 10
      const length = duration + 1;
      return Array.from({ length }, (_, i) => hours + i);
    },
    async handleFetchDayBookings(modelData) {
      try {
        await this.bookingsStore.fetchChargerBookings();
        const data = this.bookingsStore.bookingList;
        console.log('modelData', modelData);
        console.log('Successfully retrieve all bookings in that charger', data);
        // filter to the specific date chosen
        this.bookings = [];
        for (const booking of data) {
          if (this.areDatesEqual(modelData, booking.booking_datetime)) {
            // match the dates
            console.log(
              'match',
              booking.booking_datetime,
              booking.booking_duration_hours
            );
            this.dayBookings.push(
              this.getHoursBooked(
                booking.booking_datetime,
                booking.booking_duration_hours
              )
            );
            console.log('unavailable dayBookings', this.dayBookings);
            this.populateCalendar(this.dayBookings[0]);
          } else {
            this.populateCalendar(this.dayBookings);
          }
        }
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    },

    populateCalendar(dayBookings) {
      // Define an array of suffixes for 12-hour format (am/pm)
      console.log('dayBookings', dayBookings);
      const suffixes = ['am', 'pm'];

      // Initialize listItems as an empty array
      this.listItems = [];

      // Loop through 24 hours
      for (let i = 0; i < 24; i++) {
        // Calculate the hour in 12-hour format
        let hour12 = i % 12 || 12;

        // Determine the suffix (am/pm)
        let suffix = suffixes[Math.floor(i / 12)];

        // Determine the color based on whether the id exists in dayBookings
        let color = dayBookings.includes(i) ? 'bg-slate-300' : 'bg-green';

        let status = dayBookings.includes(i) ? false : true;

        let rawHour12 = this.convertTo24Hour(`${hour12}${suffix}`);

        // Create an object for the current hour
        let listItem = {
          id: i, // Set id to i instead of i + 1
          timing: `${hour12} ${suffix} • ${
            status ? 'Available' : 'Unavailable for booking'
          }`, // Combine hour and suffix
          color: color, // Assign the determined color
          rawTiming: rawHour12,
          date: this.date,
          status: status,
        };

        // Push the object to the listItems array
        this.listItems.push(listItem);
      }
    },

    onItemClick(index) {
      console.log('index', index);
      console.log('index', this.dayBookings);

      // Check if dayBookings is empty or if index is not in dayBookings
      if (
        this.dayBookings.length === 0 ||
        !this.dayBookings[0].includes(index)
      ) {
        // Toggle the background color for the clicked item
        if (this.listItems[index].color === 'bg-blue') {
          // If color is blue, change it to green and add item to createdBookingList
          this.listItems[index].color = 'bg-green';

          // Find the index of the item in createdBookingList and remove it
          const itemIndex = this.createdBookingList.findIndex(
            (item) => item.id === index
          );
          if (itemIndex !== -1) {
            this.createdBookingList.splice(itemIndex, 1);
          }
        } else {
          // If color is green, change it to blue and remove item from createdBookingList
          this.listItems[index].color = 'bg-blue';
          this.createdBookingList.push(this.listItems[index]);
        }
        this.hideBookButton = false;
      }

      console.log('listItems', this.listItems);
      console.log('createdBookingList', this.createdBookingList);
    },

    onDrawerClose() {
      this.hideButtonsView = true;
      this.hideCardBoxWidget = false;
    },
    onBackClick() {
      this.hideButtonsView = false;
      this.hideCardBoxWidget = true;
    },

    // changeTab() {
    //   this.$router.push(this.pageName);
    // },
    bookSlot() {
      this.$emit('book-slot');
    },
  },
};
</script>

<style scoped>
.drawer_bottom .drawer-toggle:checked ~ .drawer-side > *:not(.drawer-overlay) {
  transform: translateY(0%);
}

.drawer_bottom .drawer-toggle ~ .drawer-side > *:not(.drawer-overlay) {
  transform: translateY(100%);
}

.bottomDrawer {
  background: white;
  color: black;
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 20px 20px 0 0;
}

.menu {
  display: relative;
}
</style>
