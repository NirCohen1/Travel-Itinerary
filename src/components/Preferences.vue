<template>
  <div id="app">
    <div id="food-choice" :class="{ 'hide-div': this.HideFood }">
      <div
        class="choice-container"
        v-for="(image, index) in images"
        :key="index"
        @click="selectChoice(index)"
        :class="{ selected: this.chosen === index }"
      >
        <!-- :class="{ selected: selectedChoices.includes(index) }" -->

        <div class="choice-box" :style="{ backgroundImage: 'url(' + image + ')' }"></div>
      </div>
      <!-- <p v-if="selectedChoices.length === 0" class="error-message">
        Please choose at least one option.
      </p> -->
      <p v-if="chosen === -1" class="error-message">Please choose at least one option.</p>
      <button @click="submitChoices">Submit Choices</button>
    </div>
    <!-- <div :class="{ 'hide-div': !isHidden }"> -->
    <DetailsForm :json-data="jsonData" @data-received="handleReceivedData" />
    <!-- </div> -->
  </div>
</template>

<script>
import DetailsForm from './DetailsForm.vue'

export default {
  name: 'Preferences',
  components: {
    DetailsForm,
  },
  data() {
    return {
      images: [
        '/src/assets/food_choice/french.jpg',
        '/src/assets/food_choice/greek.jpg',
        '/src/assets/food_choice/israel.jpg',
        '/src/assets/food_choice/italy.jpg',
        '/src/assets/food_choice/thai.webp',
        '/src/assets/food_choice/indian.avif',
      ],
      FoodType: {
        French: 'french_restaurant',
        Greek: 'greek_restaurant',
        Israeli: 'israeli_restaurant',
        Italian: 'italian_restaurant',
        Thai: 'thai_restaurant',
        Indian: 'indian_restaurant',
        Japanese: 'japanese_restaurant',
      },
      chosen: -1,
      HideFood: false,
      jsonData: {},
      cuisine: null,
      userLocation: null,
      receivedData: null,
    }
  },
  methods: {
    handleReceivedData(data) {
      console.log('Data received from DetailsForm:', data)
      this.$emit('json-data', data) // Emit event with data
    },
    selectChoice(index) {
      this.chosen = index
      console.log(index)
      console.log(Object.values(this.FoodType))
      this.cuisine = Object.values(this.FoodType)[index] || null
    },
    async submitChoices() {
      if (this.chosen >= 0) {
        alert('Choices submitted: ' + this.cuisine)
      } else {
        alert('Please choose at least one option.')
      }
    },
    async fetchUserLocation() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLocation = `${position.coords.latitude},${position.coords.longitude}`
            resolve()
          },
          (error) => {
            console.error('Error getting location:', error)
            alert('Error getting location: ' + error.message)
            reject()
          },
        )
      })
    },
    async fetchFullRequest() {
      if (!this.userLocation) {
        console.error('User location not available.')
        return
      }

      try {
        // Define the URL for the API request
        const full_request_api = `${state.server_domain}/api/full-request`

        // Prepare the request body
        const requestData = {
          location: this.userLocation, // Use the user's current location
          radius: 3000,
          cuisine: this.cuisine, // Send the selected cuisine type
        }

        // Make the single API request
        const response = await fetch(full_request_api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })

        // Check if the response is okay
        if (!response.ok) {
          throw new Error('Request failed')
        }

        // Parse the JSON data from the response
        const data = await response.json()
        this.jsonData = data

        // Handle the combined data
        console.log('Data from full request:', data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
  },
}
</script>

<style scoped>
.choice-container {
  display: inline-block;
  margin: 10px;
}

.choice-box {
  width: 200px;
  height: 200px;
  background-size: cover;
  background-position: center;
  border: 2px solid #ccc;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.choice-box:hover {
  transform: scale(1.05);
}

.selected {
  border-color: rgb(198, 151, 126);
  box-shadow: 0 0 30px rgba(164, 19, 57, 0.5);
}

.error-message {
  color: red;
  font-weight: bold;
}

button {
  margin-top: 20px;
}

.hide-div {
  display: none;
}
</style>
