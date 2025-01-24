<template>
  <div :class="HideFood ? 'hide-div' : 'on-hover-image'" :style="style_app">
    <div id="food-choice" class="container">
      <div class="grid-container">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="choice-wrapper"
          @click="selectChoice(index)"
        >
          <div
            class="choice-box"
            :class="{ selected: chosen === index }"
            :style="{ backgroundImage: `url(${image})` }"
            @mouseover="() => mouseOverFn(index)"
          >
            <div class="overlay">
              <span class="cuisine-name">
                {{ getCuisineName(image) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="submit-section">
        <p v-if="chosen === -1" class="error-message">Please choose a cuisine</p>
        <button @click="submitChoices" :disabled="chosen === -1" class="submit-btn">
          Discover Restaurants
        </button>
      </div>
    </div>
  </div>
  <div id="form" v-if="HideFood">
    <DetailsForm @data-received="handleReceivedData" />
  </div>
</template>

<script>
import DetailsForm from './DetailsForm.vue'

export default {
  name: 'Preferences',
  emits: ['json-data'],
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
      },
      chosen: -1,
      spiral_i: 0,
      style_app: null,
      userLocation: null,
      receivedData: null,
      cuisine: null,
      interval_carousel: null,
      HideFood: false,
      submited_1: false,
      city_list: [],
      jsonData: {},
    }
  },
  methods: {
    getCuisineName(image) {
      const fileName = image.split('/').pop().split('.')[0]
      return fileName.charAt(0).toUpperCase() + fileName.slice(1)
    },
    selectChoice(index) {
      this.chosen = index
    },
    mouseOverFn(index) {
      let city = Object.keys(this.FoodType)[index]
      this.city_list = []
      for (let i = 1; i < 5; i++) {
        this.city_list.push('/src/assets/city_photos/' + city + '/' + i + '.jpg')
      }
      // immediate first image
      this.style_app = {
        backgroundImage: `url(${this.city_list[this.spiral_i]})`,
        transition: 'background-image 1s ease',
      }
      clearInterval(this.interval_carousel)
      this.interval_carousel = setInterval(this.carousel, 3000)
    },
    carousel() {
      this.spiral_i = (this.spiral_i + 1) % this.city_list.length
      console.log(this.city_list[this.spiral_i])
      this.style_app = {
        backgroundImage: `url(${this.city_list[this.spiral_i]})`,
        transition: 'background-image 1s ease-in',
      }
    },
    beforeDestroy() {
      clearInterval(this.interval_carousel)
      this.interval_carousel = null
    },
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
        alert('Choices submitted: ' + Object.values(this.FoodType)[this.chosen])
        this.HideFood = true
        clearInterval(this.interval_carousel)
        this.interval_carousel = null
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
.on-hover-image {
  background-position: center; /* Center the image */
  background-repeat: no-repeat;
  background-size: cover;
  image-rendering: auto;
  transition: background-image 1s ease;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  /* background: rgba(255, 255, 255, 0.9); */
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin-bottom: 2rem;
}

.choice-wrapper {
  perspective: 1000px;
  transition: transform 0.5s;
  /* border: rgb(90, 78, 78);
  border-style: solid; */
  box-shadow: 0 10px 5px rgba(0, 0, 0, 0.2);
}

.choice-wrapper:hover {
  transform: scale(1.05);
}

.choice-box {
  width: 300px;
  height: 300px;
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.choice-box .overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.choice-box:hover .overlay {
  opacity: 1;
}

.cuisine-name {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px black;
}

.choice-box.selected {
  border: 4px solid #ff6b6b;
  box-shadow: 0 0 30px rgba(255, 107, 107, 0.5);
}

.submit-section {
  text-align: center;
}

.submit-btn {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.submit-btn:hover {
  background-color: #ff4757;
  transform: translateY(-3px);
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #394dce;
  margin-bottom: 1rem;
  font-weight: bold;
}
.hide-div {
  display: none;
}
</style>
