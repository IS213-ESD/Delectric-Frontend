<template>
  <div class="z-10 drawer drawer-end">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <!-- Page content here -->
    </div>
    <div class="drawer-side">
      <label
        for="my-drawer-4"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <!-- Sidebar content here -->
        <li class="mt-24">
          <h2>Pick a date</h2>
          <VueDatePicker
            v-model="date"
            :model-value="date"
            @update:model-value="handleDate"
            dark
            :is-24="false"
            placeholder="Select Date"
            minutes-increment="15"
            :start-time="startTime"
          />
        </li>
        <li>
          <h2>Duration of booking(Hrs)</h2>
          <select
            class="select select-bordered max-w-xs w-4/5 ml-4"
            v-model="hoursBooked"
          >
            <option disabled selected>Select</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
          </select>
        </li>
        <div>
          <p v-if="showClearFilterButton">Date Selected: {{ date }}</p>
          <p v-if="showClearFilterButton">
            Duration of Booking: {{ hoursBooked }}
          </p>
        </div>

        <button
          v-if="showClearFilterButton"
          class="relative m-auto btn btn-wide btn-active"
          @click="clearFilter"
        >
          Clear Filter
        </button>

        <button
          v-else
          class="relative m-auto btn btn-wide btn-primary"
          @click="filterOptions"
        >
          Filter options
        </button>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import { useMainStore } from '@/stores/main';
import { useChargersStore } from '@/stores/chargers';

export default {
  components: {
    VueDatePicker,
  },
  data() {
    return {
      hoursBooked: null,
      showClearFilterButton: false,
      date: new Date(),
      startTime: { hours: new Date().getHours() + 1, minutes: 0 },
    };
  },
  computed: {
    mainStore() {
      return useMainStore();
    },
    chargersStore() {
      return useChargersStore();
    },
  },
  methods: {
    handleDate(modelData) {
      this.date = modelData;
      // do something else with the data
      console.log(modelData);
    },
    filterOptions() {
      // Access the value of hoursBooked
      console.log('Selected hours booked:', this.hoursBooked);
      console.log('Date and Time selected:', this.date);
      this.showClearFilterButton = true;
      console.log(this.showClearFilterButton);
      const valuee = this.showClearFilterButton;
      this.$emit('is-filtered', valuee);
      this.sendBookingFilter(this.date, this.hoursBooked);

      // Perform filtering logic or other actions with the selected value
    },
    sendBookingFilter(date, hoursBooked) {
      this.mainStore.receiveBookingFilter(date, hoursBooked);
    },
    clearFilter() {
      this.showClearFilterButton = false;
      this.$emit('is-filtered', this.showClearFilterButton);
    },
  },
};
</script>
