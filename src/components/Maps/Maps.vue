<template>
  <div>
    <GMapMap :center="center" :zoom="zoom" :style="mapStyle" style="width: 100%; height: 700px">
      <!-- Display current location marker -->
      <GMapMarker :position="center" icon="https://maps.google.com/mapfiles/kml/pal2/icon31.png" />

      <!-- Display multiple markers -->
      <GMapMarker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
        :clickable="true"
        :animation="'BOUNCE'"
        @click="selectMarker(marker)"
      />
    </GMapMap>
  </div>
</template>

<script>
export default {
  name: 'GoogleMaps',

  data() {
    return {
      center: { lat: 1.2963, lng: 103.8502 }, // Initialize with a default coordinate
      zoom: 16,
      markers: [],
      gestureHandling: 'greedy',

      mapStyle: {
        width: '100%',
        height: '400px',
        backgroundColor: '#f5f5f5', // Set background color
        borderRadius: '20px' // Add border radius
      },
      mapTypeId: 'satellite'
    }
  },
  mounted() {
    // Get current location using Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Set the center to the user's current location
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        // Add multiple markers around the current location
        this.addMarkersAroundCurrentLocation()
      },
      (error) => {
        console.error('Error getting current location:', error)
      }
    )
  },
  methods: {
    addMarkersAroundCurrentLocation() {
      // Generate random positions around the current location for demonstration
      for (let i = 0; i < 5; i++) {
        const randomOffset = Math.random() / 100 // Small random offset
        const lat = this.center.lat + randomOffset
        const lng = this.center.lng + randomOffset
        this.markers.push({ position: { lat, lng } })
      }
    },
    selectMarker(marker) {
      // Handle marker click event
      console.log('Marker clicked:', marker)
    }
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
