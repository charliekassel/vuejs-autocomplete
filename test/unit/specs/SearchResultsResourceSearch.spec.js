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
    wrapper.vm.search()
    const spy = jest.spyOn(wrapper.vm, 'resourceSearch')
    expect(spy).toHaveBeenCalledTimes(0)
  })

  it('should not search without display data - function source', () => {
    wrapper.setProps({
      source: (query) => `localhost/search?my-query-param=${query}`
    })
    wrapper.vm.search()
    const spy = jest.spyOn(wrapper.vm, 'resourceSearch')
    expect(spy).toHaveBeenCalledTimes(0)
  })

  it('should handle results returned as an array', async () => {
    wrapper.setProps({
      resultsProperty: null
    })
    fetch.mockResponse(JSON.stringify([{id: 1, name: 'abc'}, {id: 2, name: 'def'}]))
    await wrapper.vm.request('localhost')
    expect(wrapper.vm.results).toHaveLength(2)
    expect(wrapper.emitted().results).toBeTruthy()
    const items = wrapper.findAll('.autocomplete__results__item')
    expect(items).toHaveLength(2)
  })

  it('should handle set results as an array with unexpected response', async () => {
    fetch.mockResponse(JSON.stringify(1))
    await wrapper.vm.request('localhost')
    expect(wrapper.vm.results).toHaveLength(0)
    expect(wrapper.emitted().noResults).toBeTruthy()
    const items = wrapper.findAll('.autocomplete__results__item')
    expect(items).toHaveLength(0)
  })

  it('should show results', async () => {
    fetch.mockResponse(JSON.stringify({data: [{id: 1, name: 'abc'}, {id: 2, name: 'def'}]}))
    await wrapper.vm.request('localhost')
    expect(wrapper.vm.results).toHaveLength(2)
    expect(wrapper.emitted().results).toBeTruthy()
    const items = wrapper.findAll('.autocomplete__results__item')
    expect(items).toHaveLength(2)
  })

  it('should show no results', async () => {
    fetch.mockResponse(JSON.stringify({data: []}))
    wrapper.vm.focus()
    await wrapper.vm.request('localhost')
    expect(wrapper.vm.results).toHaveLength(0)
    expect(wrapper.emitted().noResults).toBeTruthy()
    expect(wrapper.find('.autocomplete__no-results')).toBeDefined()
    expect(wrapper.find('.autocomplete__no-results').text()).toEqual('No Results.')
  })

  it('should construct the source url from a function', () => {
    fetch.mockResponse(JSON.stringify({data: [{id: 1, name: 'abc'}]}))
    const spy = jest.spyOn(wrapper.vm, 'resourceSearch')
    wrapper.setProps({
      source: (query) => `localhost/search?my-query-param=${query}`
    })
    wrapper.setData({
      display: 'abc'
    })
    wrapper.vm.search()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('localhost/search?my-query-param=abc')
  })

  it('should throw when source is not an expected type', () => {
    wrapper.setProps({
      source: {}
    })
    expect(() => wrapper.vm.search()).toThrowError(TypeError)
  })

  it('should set custom headers', () => {
    wrapper.setProps({
      requestHeaders: {
        'x-my-custom-header': 'foobar'
      }
    })
    expect(wrapper.vm.getHeaders()).toBeInstanceOf(Headers)
    expect(wrapper.vm.getHeaders().get('x-my-custom-header')).toEqual('foobar')
  })

  it('sets results with a custom formatter', async () => {
    wrapper.setProps({
      resultsProperty: null,
      resultsFormatter: response => response.map(data => ({id: data.id, name: data.item.name}))
    })
    fetch.mockResponse(JSON.stringify([{id: 1, item: {name: 'abc'}}, {id: 2, item: {name: 'def'}}]))
    await wrapper.vm.request('localhost')
    expect(wrapper.vm.results).toHaveLength(2)
    expect(wrapper.vm.results[0].name).toEqual('abc')
    expect(wrapper.vm.results[1].name).toEqual('def')
  })
})
