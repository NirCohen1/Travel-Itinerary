<template>
  <div class="form-container">
    <div class="form-wrapper">
      <h2 class="form-title">Event Planning Wizard</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="maxBudget">Max Budget</label>
          <input
            type="number"
            id="maxBudget"
            v-model="maxBudget"
            placeholder="Enter maximum budget"
            required
            min="0"
          />
        </div>

        <div class="form-group">
          <label for="guests">Number of Guests</label>
          <input
            type="number"
            id="guests"
            v-model="guests"
            placeholder="Enter number of guests"
            required
            min="1"
          />
        </div>

        <div class="form-group">
          <label for="selectedLocation">Location</label>
          <input
            type="text"
            id="selectedLocation"
            v-model="selectedLocation"
            :placeholder="useCurrentLocation ? 'Using current location' : 'Enter city or location'"
            :disabled="useCurrentLocation"
            :required="!useCurrentLocation"
            ref="locationInput"
          />
          <div class="location-checkbox">
            <input type="checkbox" id="useCurrentLocation" v-model="useCurrentLocation" />
            <label for="useCurrentLocation">Use my current location</label>
          </div>
          <span v-if="locationError" class="error-message">{{ locationError }}</span>
        </div>

        <button type="submit">Submit Event Details</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['json-data'],
  data() {
    return {
      maxBudget: '',
      guests: '',
      location: '',
      autocomplete: null,
      useCurrentLocation: false,
      selectedLocation: '',
      userLocation: {},
      locationLatLng: null,
      locationError: '',
      googleMapsScript: null,
    }
  },
  methods: {
    async submitForm() {
      if (!this.useCurrentLocation && !this.locationLatLng) {
        this.locationError = 'Please select a valid location from the autocomplete suggestions.'
        return
      }

      this.locationError = ''

      const location =
        this.useCurrentLocation && this.userLocation.lat
          ? `${this.userLocation.lat},${this.userLocation.lng}`
          : `${this.locationLatLng.lat},${this.locationLatLng.lng}`

      const formData = {
        maxBudget: this.maxBudget,
        guests: this.guests,
        location,
      }

      console.log('Form Data:', formData)
      this.$emit('json-data', formData)
    },
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            this.userLocation = { lat, lng }
          },
          (error) => {
            console.error('Error getting location:', error.message)
          },
        )
      }
    },
    loadGoogleMapsScript() {
      if (window.google && window.google.maps) {
        this.initializeAutocomplete()
        return
      }

      this.googleMapsScript = document.createElement('script')
      this.googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_apiKey}&libraries=places`
      this.googleMapsScript.async = true

      this.googleMapsScript.onload = () => {
        this.initializeAutocomplete()
      }

      document.head.appendChild(this.googleMapsScript)
    },
    initializeAutocomplete() {
      const input = this.$refs.locationInput
      const options = {
        types: ['(cities)'],
      }

      this.autocomplete = new google.maps.places.Autocomplete(input, options)
      this.autocomplete.addListener('place_changed', this.handlePlaceChanged)
    },
    handlePlaceChanged() {
      const place = this.autocomplete.getPlace()
      if (place && place.geometry && place.geometry.location) {
        this.locationLatLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
        this.selectedLocation = place.formatted_address
        this.locationError = ''
      } else {
        this.locationLatLng = null
        this.locationError =
          'Invalid location. Please select a valid place from the autocomplete suggestions.'
      }
    },
  },
  mounted() {
    this.getUserLocation()
    this.loadGoogleMapsScript()
  },
  beforeUnmount() {
    if (this.googleMapsScript) {
      document.head.removeChild(this.googleMapsScript)
    }
  },
}
</script>

<style scoped>
.form-container {
  background: linear-gradient(135deg, #f0f8ff, #e6f2ff);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.form-wrapper {
  background-color: white;
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.form-wrapper:hover {
  transform: scale(1.02);
}

.form-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #34495e;
}

input[type='number'],
input[type='text'] {
  width: 100%;
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  background-color: #ecf0f1;
  transition: all 0.3s ease;
}

input[type='number']:focus,
input[type='text']:focus {
  border-color: #3498db;
  outline: none;
  background-color: white;
}

.location-checkbox {
  margin-top: 10px;
}

.error-message {
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 15px;
}

button:hover {
  background-color: #2980b9;
}
</style>
