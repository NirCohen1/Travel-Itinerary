<template>
  <div>
    <Preferences @json-data="handleJsonData" />
    <MapComponent :locations="locations" />
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
    return { locations: [] }
  }, // Shared state for locations }; },
  methods: {
    handleJsonData(data) {
      this.locations = data
    },
  },
}
</script>

<style>
/* Basic styles */
</style>
