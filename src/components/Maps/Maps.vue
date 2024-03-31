<template>
  <div>
    <GMapMap
      :center="center"
      :zoom="zoom"
      :style="mapStyle"
      :disableDefaultUI="disableDefaultUI"
      style="width: 100%; height: 700px"
    >
      <!-- Display current location marker -->
      <GMapMarker
        :position="center"
        icon="https://maps.google.com/mapfiles/kml/pal2/icon31.png"
      />
      <GMapCircle
        :center="center"
        :radius="circleRadius"
        :options="circleOptions"
      />

      <!-- Display multiple markers -->
      <GMapMarker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
        :clickable="true"
        @click="selectMarker(marker)"
      />
    </GMapMap>
    <CustomDrawer
      :drawer-id="1"
      :drawer-title="cardContent[0].name"
      :drawer-subtitle="cardContent[0].street"
      :button-true="buttonText"
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
import CustomDrawer from '@/components/Drawer/CustomDrawer.vue';
import { toggleDrawer } from '@/helpers/common';

import { computed, ref, onMounted, watch } from 'vue';

export default {
  name: 'GoogleMaps',
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
      zoom: 16,
      markers: [],
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      circleRadius: 100, // Set radius of the circle in meters
      currentLocationImage: null,
      center: { lat: null, lng: null },
      circleOptions: {
        strokeColor: 'blue',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'blue',
        fillOpacity: 0.35,
      },
      adress: null,
      mapStyle: {
        width: '100%',
        height: '400px',
        backgroundColor: '#f5f5f5', // Set background color
        borderRadius: '20px', // Add border radius
      },

      cardContent: [{ id: 1, name: 'Drawer Title', street: 'Drawer Subtitle' }],
      buttonText: 'Button Text',
      isFiltered: false,
    };
  },

  mounted() {
    this.getAllStations();
  },
  computed: {
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
          location: data[i].charger_location,
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
      this.logValues(marker);

      // this.handleMarkerClick(marker);
    },
    logValues(item) {
      console.log('Clicked Item:', item.name);
      console.log('Clicked Item:', item);
      this.cardContent.value = [];
      this.cardContent.value.push({
        id: item.id,
        name: item.name,
        street: item.street,
        distance: 0.55,
      });
      console.log('cardContent', this.cardContent);
      toggleDrawer('1');
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
