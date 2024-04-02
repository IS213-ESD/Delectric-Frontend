<template>
  <div>
    <GMapMap
      :center="center"
      :zoom="zoom"
      :style="mapStyle"
      :disableDefaultUI="disableDefaultUI"
      style="width: 100%; height: 700px"
      :options="{
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'landscape.natural',
            elementType: 'geometry.fill',
            stylers: [{ visibility: 'on' }, { color: '#e0efef' }],
          },
          {
            featureType: 'poi',
            elementType: 'geometry.fill',
            stylers: [
              { visibility: 'on' },
              { hue: '#1900ff' },
              { color: '#c0e8e8' },
            ],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ lightness: 100 }, { visibility: 'simplified' }],
          },
          {
            featureType: 'road',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{ visibility: 'on' }, { lightness: 700 }],
          },
          {
            featureType: 'water',
            elementType: 'all',
            stylers: [{ color: '#7dcdcd' }],
          },
        ],
      }"
    >
      <!-- Display current location marker -->
      <GMapMarker
        :position="center"
        :icon="{
          url: currentLocationImage,
          scaledSize: { width: 77, height: 77 },
          labelOrigin: { x: 16, y: 0 },
        }"
      />

      <!-- Display multiple markers -->
      <GMapMarker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
        :clickable="true"
        @click="selectMarker(marker)"
        :icon="{
          url: chargerMarker,
          scaledSize: { width: 50, height: 50 },
          labelOrigin: { x: 16, y: 0 },
        }"
      />
    </GMapMap>
    <CustomDrawer
      :drawer-id="2"
      :card-id="this.cardContent[0].id"
      :drawer-title="this.cardContent[0].name"
      :drawer-subtitle="this.cardContent[0].street"
      button-false="Explore Booking Slots"
      @book-slot="handleBookSlot"
      :disabled="isFiltered"
    >
    </CustomDrawer>
  </div>
</template>

<script>
import { useMainStore } from '@/stores/main';
import { useChargersStore } from '@/stores/chargers';
import currentLocationImage from '@/assets/currentLocation.png';
import chargerMarker from '@/assets/charger.png';
import CustomDrawer from '@/components/Drawer/CustomDrawer.vue';
import { toggleDrawer } from '@/helpers/common';

import { computed, ref, onMounted, watch } from 'vue';

export default {
  name: 'GoogleMaps',
  components: {
    CustomDrawer,
    currentLocationImage,
    chargerMarker,
  },
  props: {
    MarkerAddress: {
      type: String,
      default: '',
    },
    number: {
      type: Number,
      default: 0,
    },
    icon: {
      type: Image,
      default: null,
    },
    prefix: {
      type: String,
      default: null,
    },
    suffix: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    street: {
      type: String,
      default: null,
    },
    distance: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: null,
    },
    trend: {
      type: String,
      default: null,
    },
    trendType: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      // center: { lat: 1.0963, lng: 103.8502 }, // Initialize with a default coordinate
      zoom: 14,
      markers: [],
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      circleRadius: 100, // Set radius of the circle in meters
      currentLocationImage: null,
      chargerMarker: null,
      center: { lat: null, lng: null },

      adress: null,
      mapStyle: {
        width: '100%',
        height: '400px',
        backgroundColor: '#f5f5f5', // Set background color
        borderRadius: '20px', // Add border radius
      },

      cardContent: [
        { id: 1, name: 'NAFA Campus 1', street: 'ljfnvjnv', distance: 0.55 },
      ],
      buttonText: 'Button Text',
      isFiltered: false,
      isLoading: false,
    };
  },

  mounted() {
    this.getAllStations();
  },
  computed: {
    buttonText() {
      return this.isFiltered
        ? this.isLoading
          ? 'Loading...'
          : 'Book Slot'
        : 'Please filter before selecting';
    },
    mainStore() {
      return useMainStore();
    },
    chargersStore() {
      return useChargersStore();
    },
    center() {
      console.log('init center', this.mainStore.center);
      return this.mainStore.center;
    },
  },
  created() {
    this.mainStore = useMainStore();
    this.center = {
      lat: this.mainStore.latitude,
      lng: this.mainStore.longitude,
    };
    this.currentLocationImage = currentLocationImage;
    this.chargerMarker = chargerMarker;
  },
  methods: {
    handleBookSlot() {
      // Your method logic here
    },
    updateStoreLocation(latitude, longitude) {
      // const mainStore = useMainStore();
      this.mainStore.updateStoreLocation(latitude, longitude);
    },

    async handleMarkerClick(marker) {
      const lat = marker.position.lat;
      const lng = marker.position.lng;
      // Display the address in a tooltip or info window
      const address = null;
      marker.tooltip = address;
      console.log(marker);
      this.$emit('marker-address', address);
    },
    async getAllStations() {
      try {
        await this.chargersStore.fetchAllStations();
        const data = this.chargersStore.chargerslist;
        console.log('Successfully retrieve all stations', data);
        this.addMarkersAroundCurrentLocation(data);
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    },
    addMarkersAroundCurrentLocation(data) {
      // Generate random positions around the current location for demonstration
      for (let i = 0; i < data.length; i++) {
        console.log(data);
        const lat = data[i].latitude;
        const lng = data[i].longitude;
        const marker = {
          id: data[i].charger_id,
          street: data[i].charger_location,
          name: data[i].charger_name,
          position: { lat, lng },
          tooltip: '',
        };
        marker.onClick = () => this.handleMarkerClick(marker);
        this.markers.push(marker);
      }
    },
    selectMarker(marker) {
      // Handle marker click event
      console.log('Marker clicked:', marker);
      this.logChildValues(marker);

      // this.handleMarkerClick(marker);
    },
    logChildValues(item) {
      console.log('Clicked Item:', item.name);
      console.log('Clicked Item:', item);
      this.cardContent = [];
      this.cardContent.push({
        id: item.id,
        name: item.name,
        street: item.street,
        distance: 0.55,
      });
      console.log('cardContent', this.cardContent);
      toggleDrawer('2');
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
.gmap-marker img {
  width: 32px;
  height: 32px;
}
</style>
