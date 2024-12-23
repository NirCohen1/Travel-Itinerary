<template>
  <div class="form-container">
    <h2>Budget and Event Form</h2>
    <form @submit.prevent="submitForm">
      <!-- Max Budget -->
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

      <!-- Number of Guests -->
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

      <!-- Location (with autocomplete) -->
      <div class="form-group">
        <label for="location">Location</label>
        <input
          type="text"
          id="selectedLocation"
          v-model="selectedLocation"
          :placeholder="useCurrentLocation ? 'Using current location' : 'Enter city or location'"
          :disabled="useCurrentLocation"
          :required="!useCurrentLocation"
          ref="locationInput"
        />
        <div>
          <input type="checkbox" id="useCurrentLocation" v-model="useCurrentLocation" />
          <label for="useCurrentLocation">Use my current location</label>
        </div>
        <span v-if="locationError" class="error">{{ locationError }}</span>
      </div>

      <!-- Submit Button -->
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader'

export default {
  data() {
    return {
      maxBudget: '',
      guests: '',
      location: '',
      autocomplete: null,
      googleMapsLoaded: false,
      useCurrentLocation: false,
      selectedLocation: '',
      userLocation: {},
      locationLatLng: null, // Stores the validated lat/lng
      locationError: '', // Error message for location validation
    }
  },
  methods: {
    async submitForm() {
      if (!this.useCurrentLocation && !this.locationLatLng) {
        this.locationError = 'Please select a valid location from the autocomplete suggestions.'
        return
      }

      this.locationError = '' // Clear any previous errors

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

      // Uncomment the following to send data to your backend
      // const forwardResponse = await axios.post('http://localhost:3000/api/search-hotels', formData);

      // Emit to Preferences
      this.$emit('json-data', formData)
    },
    getUserLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          this.userLocation = { lat, lng }
        },
        (error) => {
          alert('Error getting location: ' + error.message)
        },
      )
    },
    loadGoogleMapsAPI() {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_apiKey,
        version: 'weekly',
        libraries: ['places'],
      })

      loader.load().then(() => {
        this.googleMapsLoaded = true
        this.initializeAutocomplete()
      })
    },
    initializeAutocomplete() {
      const input = this.$refs.locationInput
      const options = {
        types: ['(cities)'], // Restrict to cities
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
        this.locationError = '' // Clear error if valid place selected
      } else {
        this.locationLatLng = null
        this.locationError =
          'Invalid location. Please select a valid place from the autocomplete suggestions.'
      }
    },
  },
  mounted() {
    this.loadGoogleMapsAPI()
    this.getUserLocation()
  },
}
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  color: #333;
  grid-template-columns: auto auto;
}

h2 {
  grid-column: span 2;
  text-align: center;
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  padding: 5px;
  font-size: 14px;
  font-weight: 600;
  color: #34495e;
}

input[type='number'],
input[type='date'],
input[type='text'] {
  width: 100%;
  padding: 12px;
  margin-top: 6px;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  font-size: 16px;
  color: #34495e;
  background-color: #ecf0f1;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

input[type='number']:focus,
input[type='date']:focus,
input[type='text']:focus {
  border-color: #3498db;
  outline: none;
  background-color: #ffffff;
}

input::placeholder {
  color: #bdc3c7;
}

/* Min Budget & Max Budget in one row */
.budget-group {
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.budget-group input {
  flex: 1;
}

.budget-group input:first-child {
  margin-right: 10px;
}

/* Start Date & End Date in one row */
.date-group {
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.date-group input {
  flex: 1;
}

.date-group input:first-child {
  margin-right: 10px;
}

/* Smaller number of guests input */
.number-guests input {
  width: 50%;
}

/* Submit button */
button {
  grid-column: span 2;
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
  margin-top: 25px;
}

button:hover {
  background-color: #2980b9;
}

button:focus {
  outline: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-container {
    grid-template-columns: 1fr;
    padding: 15px;
  }

  h2 {
    font-size: 20px;
  }

  input[type='number'],
  input[type='date'],
  input[type='text'] {
    font-size: 14px;
    padding: 10px;
  }

  button {
    font-size: 14px;
    padding: 10px;
  }

  .budget-group,
  .date-group {
    grid-column: span 1;
  }

  .number-guests input {
    width: 100%;
  }
  .error-message {
    color: red;
    margin-top: 10px;
    font-size: 0.9em;
    margin-top: 0.5em;
  }
}
</style>
