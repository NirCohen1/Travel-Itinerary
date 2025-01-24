<template>
  <div>
    <Preferences @json-data="handleJsonData" />
    <div v-if="preferences_done">
      <MapComponent :locations="locations" />
    </div>
  </div>
</template>

<script>
import MapComponent from './components/MapComponent.vue'
import Preferences from './components/Preferences.vue'

export default {
  name: 'App',
  components: {
    MapComponent,
    Preferences,
  },
  data() {
    return { locations: [], preferences_done: false }
  }, // Shared state for locations }; },
  methods: {
    handleJsonData(data) {
      this.preferences_done = true
      this.locations = data
    },
  },
}
</script>

<style>
/* Basic styles */
</style>
