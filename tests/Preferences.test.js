import { mount } from '@vue/test-utils'
import Preferences from '../src/components/Preferences.vue'

describe('Preferences.vue', () => {
  it('emits json-data with correct payload', () => {
    const wrapper = mount(Preferences)

    // Simulate user interaction
    wrapper.find('button').trigger('click')

    expect(wrapper.emitted()['json-data']).toBeTruthy()
    expect(wrapper.emitted()['json-data'][0]).toEqual([
      {
        /* expected data here */
      },
    ])
  })
})
