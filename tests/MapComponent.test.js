import { shallowMount } from '@vue/test-utils'
import MapComponent from '../src/components/MapComponent.vue'

describe('MapComponent.vue', () => {
  it('renders map and markers correctly', async () => {
    const locations = [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 34.0522, lng: -118.2437 },
    ]

    const wrapper = shallowMount(MapComponent, {
      propsData: { locations },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.map).toBeDefined()

    locations.forEach((location) => {
      expect(wrapper.vm.map.markers).toContainEqual(expect.objectContaining({ position: location }))
    })
  })
})
