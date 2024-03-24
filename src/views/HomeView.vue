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
        {{ receiveMarker }}

        <BaseButton
          @click="toggleView"
          target="_blank"
          :icon="mdiListBox"
          :label="mapView ? 'List View' : 'Map View'"
          color="white"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>

      <FilterDrawer @is-filtered="receiveIsFiltered"></FilterDrawer>

      <div>
        <!-- Toggle button -->
        <!-- <button @click="toggleView">{{ mapView ? 'List View' : 'Map View' }}</button> -->

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
          <!-- <ul>
            <li v-for="item in listItems" :key="item.id">{{ item.name }}</li>
          </ul> -->
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            <CardBoxWidget
              v-for="item in listItems"
              :key="item.id"
              trend="12%"
              trend-type="up"
              color="text-emerald-500"
              :icon="mdiAccountMultiple"
              :distance="item.distance"
              :label="item.name"
              :street="item.street"
              @click="logValues(item)"
            />
          </div>
        </div>
      </div>

      <CustomDrawer
        :drawer-id="1"
        :page-name="hello"
        :drawer-title="cardContent[0].name"
        :drawer-subtitle="cardContent[0].street"
        :button-true="
          isFiltered ? 'Book Slot' : 'Please filter before selecting'
        "
        @book-slot="handleBookSlot"
        :disabled="isFiltered"
      >
      </CustomDrawer>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useMainStore } from '@/stores/main';
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiReload,
  mdiChartPie,
  mdiListBox,
} from '@mdi/js';
// import Charge from '@/images/charge.vue';
import CurrentAlert from '@/components/currentAlert.vue';
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

const mainStore = useMainStore();

const mapView = ref(true); // Set default view to map view
const chartData = ref(null);
const listItems = ref([]); // Array to hold list items
const receiveMarker = ref('');
const isFiltered = ref(false);
const showClearFilterButton = ref(false);

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

const receiveMarkerAdresss = (data) => {
  receiveMarker.value = data;
};

const receiveIsFiltered = async (data) => {
  await mainStore.fetchNearbyStations(
    1.3521,
    103.8198,
    1.5,
    "08:00:00",
    27,
    "2024-03-08"
    ).then(()=>{
      let data = mainStore.chargerslist;
      listItems.value = []
      if (data && Array.isArray(data)) {
        for (const item of data) {
          listItems.value.push(
          {
            id: item.charger_id,
            name: item.charger_name,
            street: item.charger_location,
            distance: item.distance,
          },
        );
          console.log(item);
        }
      } else {
        console.error("chargerslist is empty or not an array");
      }
    })

    isFiltered.value = data;

};

const getAllStations = async () => {
  try {
    await mainStore.fetchAllStations();
    const data = mainStore.chargerslist;
    console.log(data);
    listItems.value = [];
    if (data && Array.isArray(data)) {
      for (const item of data) {
        listItems.value.push({
          id: item.charger_id,
          name: item.charger_name,
          street: item.charger_location,
        });
        console.log(item);
      }
    } else {
      console.error("chargerslist is empty or not an array");
    }
  } catch (error) {
    console.error("Error fetching stations:", error);
  }
};

const handleBookSlot = (data) => {
  console.log(isFiltered.value);
  if (isFiltered.value === false) {
    toggleView();
  }
};



onMounted(() => {
  fillChartData();
  // addSampleItems();
  getAllStations();
  console.log('loaded')
});


const clientBarItems = computed(() => mainStore.clients.slice(0, 4));

const transactionBarItems = computed(() => mainStore.history);

const toggleView = () => {
  mapView.value = !mapView.value;
};

const addSampleItems = () => {
  listItems.value.push(
    {
      id: 1,
      name: 'NAFA Campus 1',
      street: '21 Tampines Avenue 1, Singapore 599242',
      distance: 0.55,
    },
    { id: 2, name: 'Odeon Towers', street: 'ljfnvjnv', distance: 0.44 },
    { id: 3, name: 'Fortune Centre', street: 'ljfnvjnv', distance: 0.35 }
  );
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

const onDrawerClose = () => {
  toggleDrawer(this.drawerId);
};
</script>
