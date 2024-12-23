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
  props: {
    locations: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      map: null,
      userLocation: null,
      markers: [],
    }
  },
  watch: {
    locations(newLocations) {
      if (this.map) {
        this.addMultipleMarkers(newLocations)
      }
    },
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

          // Add initial markers
          // this.addMultipleMarkers(this.locations)
        },
        (error) => {
          alert('Error getting location: ' + error.message)
        },
      )
    },

    // Add multiple markers for different locations
    addMultipleMarkers(locations) {
      this.clearMarkers() // Clear existing markers before adding new ones

      // Add markers for hotels
      locations.hotels.forEach((hotel) => {
        const marker = new google.maps.Marker({
          position: hotel,
          map: this.map,
          title: 'Hotel',
          icon: 'src/assets/icons/hotel_icon.jpg',
        })
        this.markers.push(marker)
      })

      // Add markers for restaurants
      locations.restaurants.forEach((restaurant) => {
        const marker = new google.maps.Marker({
          position: restaurant,
          map: this.map,
          title: 'Restaurant',
          icon: 'src/assets/icons/restaurant_icon.png',
        })
        this.markers.push(marker)
      })

      // Add markers for attractions
      locations.attractions.forEach((attraction) => {
        const marker = new google.maps.Marker({
          position: attraction,
          map: this.map,
          title: 'Attraction',
          icon: 'src/assets/icons/attraction_icon.jpg',
        })
        this.markers.push(marker)
      })
    },

    // Clear all markers from the map
    clearMarkers() {
      this.markers.forEach((marker) => marker.setMap(null))
      this.markers = []
    },
  },
}
</script>

<style scoped>
/* Styling for the map container */
#map {
  height: 500px; /* Make sure the map has a sufficient height */
  width: 50%; /* Ensure it takes up the proper width */
}
</style>
