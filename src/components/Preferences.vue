<template>
  <div id="app">
    <div id="food-choice" :class="{ 'hide-div': this.HideFood }">
      <div
        class="choice-container"
        v-for="(image, index) in images"
        :key="index"
        @click="selectChoice(index)"
        :class="{ selected: this.chosen == index }"
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
    <DetailsForm @json-data="handleJsonData" />
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
        '/src/assets/french.jpg',
        '/src/assets/greek.jpg',
        '/src/assets/israel.jpg',
        '/src/assets/italy.jpg',
        '/src/assets/thai.webp',
        '/src/assets/indian.avif',
      ],
      selectedChoices: [],
      chosen: -1,
      HideFood: false,
      select: null,
      jsonData: {},
    }
  },
  methods: {
    selectChoice(index) {
      this.chosen = index
      console.log(this.chosen)
    },
    submitChoices() {
      if (this.chosen > 0) {
        alert('Choices submitted: ' + this.chosen)
      } else {
        alert('Please choose at least one option.')
      }
    },
    //TODO sent when finish
    handleJsonData() {
      this.$emit('json-data', this.jsonData) // Emit event with data
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
