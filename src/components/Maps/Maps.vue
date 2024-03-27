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

      <!-- Display multiple markers -->
      <GMapMarker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
        :clickable="true"
        @click="selectMarker(marker)"
      />
    </GMapMap>
  </div>
</template>

<script>
import { useMainStore } from '@/stores/main';
import { useChargersStore } from '@/stores/chargers';
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
      center: { lat: 1.2963, lng: 103.8502 }, // Initialize with a default coordinate
      zoom: 16,
      markers: [],
      disableDefaultUI: true,
      gestureHandling: 'greedy',

      mapStyle: {
        width: '100%',
        height: '400px',
        backgroundColor: '#f5f5f5', // Set background color
        borderRadius: '20px', // Add border radius
      },
    };
  },

  mounted() {
    // Get current location using Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Set the center to the user's current location
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.updateStoreLocation(this.center.lat, this.center.lng);

        // Add multiple markers around the current location
        this.getAllStations();
        // this.addMarkersAroundCurrentLocation();
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
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
    updateStoreLocation(latitude, longitude) {
      // const mainStore = useMainStore();
      this.mainStore.updateStoreLocation(latitude, longitude);
    },
    async reverseGeocode(lat, lng) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyA-R-V5D-Di4Y4NcmW-DFt0Aez9AOxj5X0`
        );
        const data = await response.json();
        if (data.status === 'OK' && data.results.length > 0) {
          const address = data.results[0].formatted_address;
          return address;
        } else {
          return 'Address not found';
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        return 'Error fetching address';
      }
    },
    async handleMarkerClick(marker) {
      const lat = marker.position.lat;
      const lng = marker.position.lng;
      const address = await this.reverseGeocode(lat, lng);
      // Display the address in a tooltip or info window
      marker.tooltip = address;
      console.log(address);
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
        const lat = data[i].latitude;
        const lng = data[i].longitude;
        const marker = {
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
      this.handleMarkerClick(marker);
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
