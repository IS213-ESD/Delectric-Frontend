<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CurrentAlert
        message="Currently charging"
        submessage=""
        btnmessage="See Details"
        class="mx-auto"
      ></CurrentAlert>

      <SectionTitleLineWithButton
        :icon="mdiChartTimelineVariant"
        title="Chargers"
      >
        <div class="indicator">
          <span v-if="isFiltered" class="indicator-item badge badge-secondary"
            >1</span
          >
          <label for="my-drawer-4" class="drawer-button btn btn-accent btn-sm"
            >Filter</label
          >
        </div>

        <BaseButton
          @click="toggleView"
          target="_blank"
          :icon="mdiListBox"
          :label="mapView ? 'Map View' : 'List View'"
          color="white"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>

      <FilterDrawer
        @is-filtered="receiveIsFiltered"
        @no-filter="receiveNearbyStations"
      ></FilterDrawer>
      <div v-if="mapsLoading" class="text-center mx-auto">
        <!-- Display loading spinner or message -->
        <span class="loading loading-infinity loading-lg"></span>
      </div>
      <div v-else>
        <!-- Display map or list based on toggle state -->
        <div v-if="!mapView">
          <!-- Map View -->
          <!-- Your map component goes here -->
          <div id="map">
            <!-- Map rendering goes here -->
            <GoogleMaps @marker-address="receiveMarkerAdresss"></GoogleMaps>
          </div>
        </div>
        <div v-else>
          <!-- List View -->
          <!-- Your list component goes here -->
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            <CardBoxWidget
              v-for="item in listItems"
              :key="item.id"
              :trend="item.status"
              trend-type="up"
              color="text-emerald-500"
              :icon="mdiAccountMultiple"
              :distance="item.distance + 'km'"
              :label="item.name"
              :street="item.street"
              @click="logValues(item)"
              class="bg-slate-900 text-slate-200"
            />
          </div>
        </div>
      </div>

      <CustomDrawer
        :drawer-id="1"
        :card-id="cardContent[0].id"
        :drawer-title="cardContent[0].name"
        :drawer-subtitle="cardContent[0].street"
        button-false="Explore Booking Slots"
        @book-slot="handleBookSlot"
        :disabled="isFiltered"
      >
      </CustomDrawer>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useMainStore } from '@/stores/main';
import { useChargersStore } from '@/stores/chargers';
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiReload,
  mdiChartPie,
  mdiListBox,
} from '@mdi/js';
// import Charge from '@/images/charge.vue';
import CurrentAlert from '@/components/CurrentAlert.vue';
import * as chartConfig from '@/components/Charts/chart.config.js';
import LineChart from '@/components/Charts/LineChart.vue';
import SectionMain from '@/components/SectionMain.vue';
import CardBoxWidget from '@/components/CardBoxWidget.vue';
import CardBox from '@/components/CardBox.vue';
import TableSampleClients from '@/components/TableSampleClients.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import BaseButton from '@/components/BaseButton.vue';
import CardBoxTransaction from '@/components/CardBoxTransaction.vue';
import CardBoxClient from '@/components/CardBoxClient.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import SectionBannerStarOnGitHub from '@/components/SectionBannerStarOnGitHub.vue';
import GoogleMaps from '@/components/Maps/Maps.vue';
import CustomDrawer from '@/components/Drawer/CustomDrawer.vue';
import { toggleDrawer } from '@/helpers/common';
import FilterDrawer from '@/components/Drawer/FilterDrawer.vue';
import { useRouter } from 'vue-router';

const mainStore = useMainStore();
const chargersStore = useChargersStore();

const mapView = ref(false); // Set default view to map view
const chartData = ref(null);
const listItems = ref([]); // Array to hold list items
const receiveMarker = ref('');
const isFiltered = ref(false);
const showClearFilterButton = ref(false);
const router = useRouter();
const isLoading = ref(false);
const mapsLoading = ref(mainStore.mapsLoading);

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

const receiveMarkerAdresss = (data) => {
  receiveMarker.value = data;
};

// Function to update store location
const updateStoreLocation = async (latitude, longitude) => {
  await mainStore.updateStoreLocation(latitude, longitude);
};

const centerValue = ref(mainStore.center); // Reactive variable to hold the center value

// Watch for changes in mapsLoading
watch(
  () => mainStore.mapsLoading,
  (newValue) => {
    mapsLoading.value = newValue;
  }
);

// Watch for changes to the center value
watch(
  () => mainStore.center,
  async (newValue, oldValue) => {
    console.log('Center value changed:', newValue);

    centerValue.value = newValue; // Update the component state
    // Perform any other actions based on the new center value
    await receiveNearbyStations(); // Call receiveNearbyStations after the center value is updated
  }
);

const receiveIsFiltered = async (data) => {
  // Watch for changes in mainStore.storeLocation and call receiveIsFiltered when it changes
  watch(
    () => mainStore.storeLocation,
    async () => {
      // Make the callback function asynchronous
      console.log(mainStore.storeLocation.bookingTime);
      console.log(mainStore.storeLocation.bookingDate);
      console.log(mainStore.storeLocation.radius);
      console.log(mainStore.bookingDuration);

      try {
        // Call fetchNearbyAvailStations with the updated storeLocation and await its completion
        await chargersStore.fetchNearbyAvailStations(
          mainStore.storeLocation.latitude,
          mainStore.storeLocation.longitude,
          mainStore.storeLocation.radius,
          mainStore.storeLocation.bookingTime,
          mainStore.bookingDuration,
          mainStore.storeLocation.bookingDate
        );

        // Once the data is fetched, update listItems
        let data = chargersStore.chargerslist;
        console.log('receiveIsFiltered', data);
        listItems.value = [];
        if (data && Array.isArray(data)) {
          for (const item of data) {
            listItems.value.push({
              id: item.charger_id,
              name: item.charger_name,
              street: item.charger_location,
              distance: item.distance,
            });
          }
        } else {
          console.error('chargerslist is empty or not an array');
        }
      } catch (error) {
        console.error('Error fetching nearby stations:', error);
        // Handle error gracefully, e.g., show a message to the user
      }
    }
  );
  isFiltered.value = data;
};

const receiveNearbyStations = async () => {
  isFiltered.value = false;

  if (!centerValue.value) {
    // If centerValue is not yet initialized, wait for it to be initialized
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  try {
    await chargersStore.fetchNearbyStations(
      centerValue.value.lat,
      centerValue.value.lng,
      mainStore.storeLocation.radius
    );

    const data = chargersStore.chargerslist;
    console.log('receiveNearbyStations', data);

    listItems.value = [];
    if (data && Array.isArray(data)) {
      for (const item of data) {
        listItems.value.push({
          id: item.charger_id,
          name: item.charger_name,
          street: item.charger_location,
          distance: item.distance,
        });
      }
    } else {
      console.error('chargerslist is empty or not an array');
    }
  } catch (error) {
    console.error('Error receiving nearby stations:', error);
    // Handle error gracefully, e.g., show a message to the user
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;

  function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadiusKm * c;
  return Number(distance.toFixed(2));
}

const getAllStations = async () => {
  try {
    await chargersStore.fetchAllStations();
    const data = chargersStore.chargerslist;
    console.log('getAllStations', data);

    console.log('centerValue', centerValue.value.lat);
    console.log('centerValue', centerValue.value.lat);

    listItems.value = [];

    if (data && Array.isArray(data)) {
      for (const item of data) {
        const newDist = calculateDistance(
          centerValue.value.lat,
          centerValue.value.lng,
          item.latitude,
          item.longitude
        );

        listItems.value.push({
          id: item.charger_id,
          name: item.charger_name,
          street: item.charger_location,
          distance: newDist,
        });
      }
    } else {
      console.error('chargerslist is empty or not an array');
    }
  } catch (error) {
    console.error('Error fetching stations:', error);
  }
};

// Computed property to determine button text
const buttonText = computed(() => {
  return isFiltered.value
    ? isLoading.value
      ? 'Loading...'
      : 'Book Slot'
    : 'Please filter before selecting';
});

const handleBookSlot = (data) => {
  // console.log(isFiltered.value);
  if (isFiltered.value === false) {
    toggleView();
  }
  if (isFiltered.value) {
    isLoading.value = true; // Set loading state to true
    // Perform your async operation (e.g., API call)
    // Once the operation is complete, set isLoading back to false
    // For demonstration purpose, I'm using a setTimeout to simulate an async operation
    setTimeout(() => {
      // Simulating completion of async operation
      isLoading.value = false; // Set loading state to false
      // Perform any other actions here if needed
      router.push('/booking');
    }, 2000); // Adjust the time based on your actual async operation
  }
};

onMounted(() => {
  fillChartData();
  // addSampleItems();
  getAllStations();
  updateStoreLocation();
  receiveNearbyStations();
});

const clientBarItems = computed(() => mainStore.clients.slice(0, 4));

const transactionBarItems = computed(() => mainStore.history);

const locationData = computed(() => mainStore.storeLocation);

const toggleView = () => {
  mapView.value = !mapView.value;
};

const cardContent = ref([
  { id: 1, name: 'NAFA Campus 1', street: 'ljfnvjnv', distance: 0.55 },
]);

const logValues = (item) => {
  console.log('Clicked Item:', item.name);

  cardContent.value = [];
  cardContent.value.push({
    id: item.id,
    name: item.name,
    street: item.street,
    distance: 0.55,
  });
  console.log(cardContent);
  toggleDrawer('1');
};
</script>
