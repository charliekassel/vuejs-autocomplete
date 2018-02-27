import Autocomplete from '@/components/Autocomplete'
import {shallow} from '@vue/test-utils'
import sinon from 'sinon'
import fetchMock from 'jest-fetch-mock'

global.fetch = fetchMock

describe('Search Results - Resource', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Autocomplete, {
      propsData: {
        source: 'localhost',
        resultsProperty: 'data'
      }
    })
  })

  it('should debounce a resource search', () => {
    wrapper.setData({
      display: 'abc'
    })
    const clock = sinon.useFakeTimers()
    const spy = jest.spyOn(wrapper.vm, 'request')
    wrapper.vm.search()
    expect(spy).toHaveBeenCalledTimes(0)
    clock.tick(500)
    wrapper.update()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should not search without display data', () => {
    const spy = jest.spyOn(wrapper.vm, 'resourceSearch')
    expect(spy).toHaveBeenCalledTimes(0)
  })

  it('should show no results', () => {
    fetch.mockResponse(JSON.stringify({data: []}))
    wrapper.vm.request('localhost').then(() => {
      expect(wrapper.vm.results).toHaveLength(0)
      expect(wrapper.emitted().noResults).toBeTruthy()
      expect(wrapper.find('.autocomplete__no-results')).toBeDefined()
      expect(wrapper.find('.autocomplete__no-results').text()).toEqual('Nothing found.')
    })
  })
})
