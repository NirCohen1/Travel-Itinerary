<template>
  <div>
    <button @click="sendLocationToOtherComponent">Send Location</button>
    <div id="map" ref="map"></div>
    <!-- Make sure map div has a proper size -->
  </div>
</template>

<script>
export default {
  name: 'MapComponent',
  data() {
    return {
      map: null,
      userLocation: null,
      markers: [],
      hotels_locations: [], // This will hold multiple locations
      restaurants_locations: [],
      attraction_locations: [],
    }
  },
  mounted() {
    this.loadMap()
  },
  methods: {
    // Dynamically load the Google Maps API
    loadMap() {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.')
        return
      }

      // Dynamically load Google Maps script if not already loaded
      if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_apiKey}&libraries=places`
        script.async = true
        script.defer = true

        script.onload = () => {
          this.initMap() // Initialize map after script has loaded
        }

        script.onerror = () => {
          console.error('Failed to load Google Maps API')
        }

        document.head.appendChild(script)
      } else {
        this.initMap() // If already loaded, just initialize map
      }
    },

    // Initialize the map after the script is loaded
    initMap() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          this.userLocation = { lat, lng }

          // Create the map centered at the user's location
          this.map = new google.maps.Map(this.$refs.map, {
            center: { lat, lng },
            zoom: 14,
          })

          // Add marker for user's location
          new google.maps.Marker({
            position: this.userLocation,
            map: this.map,
            title: 'You are here',
          })

          // Optional: You can add multiple locations as well
          this.addMultipleMarkers()
        },
        (error) => {
          alert('Error getting location: ' + error.message)
        },
      )
    },
    async fetchHotelLocations() {},
    async fetchRestauratsLocations() {},
    async fetchAttractonsLocations() {},

    // Add multiple markers for different locations
    async addMultipleMarkers() {
      const locations = await this.fetchHotelLocations()

      locations.forEach((location) => {
        const marker = new google.maps.Marker({
          position: location,
          map: this.map,
          title: 'Location', // change according to the response (hotel/restaurants/attraction)
          icon: 'path/to/custom/icon.png', // Add custom icon path here
        })
        this.markers.push(marker)
      })
    },

    // Send location to another component
    sendLocationToOtherComponent() {
      this.$emit('location-sent', this.userLocation)
    },
  },
}
</script>

<style scoped>
/* Styling for the map container */
#map {
  height: 500px; /* Make sure the map has a sufficient height */
  width: 50%; /* Ensure it takes up the full width */
}
</style>
