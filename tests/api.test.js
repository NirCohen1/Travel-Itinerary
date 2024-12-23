import axios from 'axios'
import { fetchMultipleAPIs } from '../path/to/your/api/function'

jest.mock('axios')

describe('API Calls', () => {
  it('should fetch data from multiple APIs', async () => {
    // Mock API responses
    const response1 = { data: { key: 'value1' } }
    const response2 = { data: { key: 'value2' } }
    const response3 = { data: { key: 'value3' } }

    axios.get
      .mockResolvedValueOnce(response1)
      .mockResolvedValueOnce(response2)
      .mockResolvedValueOnce(response3)

    const data = await fetchMultipleAPIs()

    expect(data).toEqual([response1.data, response2.data, response3.data])
  })
})
