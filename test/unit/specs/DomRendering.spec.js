import Autocomplete from '@/components/Autocomplete'
import {shallow} from '@vue/test-utils'

describe('Renders correct DOM', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Autocomplete, {
      propsData: {
        source: 'localhost'
      }
    })
  })

  it('Has inputs', () => {
    expect(wrapper.find('input')).toBeTruthy()
    expect(wrapper.findAll('input')).toHaveLength(2)
  })

  it('renders a result list', () => {
    wrapper.setData({
      results: [
        {id: 1, name: 'a'},
        {id: 2, name: 'b'}
      ]
    })
    expect(wrapper.findAll('.autocomplete__results__item')).toHaveLength(2)
  })

  it('renders a result list with a display function', () => {
    wrapper.setProps({
      resultsDisplay: obj => obj.city
    })
    wrapper.setData({
      results: [
        {id: 1, city: 'London'},
        {id: 2, city: 'New York'}
      ]
    })
    const items = wrapper.findAll('.autocomplete__results__item')
    expect(items.at(0).text()).toEqual('London')
    expect(items.at(1).text()).toEqual('New York')
  })

  it('throws when results do not contain expected property', () => {
    const results = [
      {id: 1, city: 'London'},
      {id: 2, city: 'New York'}
    ]
    expect(() => {
      wrapper.vm.formatDisplay(results)
    }).toThrowError(Error)
  })

  it('throws when formatDisplay is not expected type', () => {
    wrapper.setProps({
      resultsDisplay: {}
    })
    expect(() => {
      wrapper.vm.formatDisplay([])
    }).toThrowError(TypeError)
  })

  it('sets isFocussed property when the input is in focus', () => {
    wrapper.find('input').trigger('focus')
    expect(wrapper.vm.isFocussed).toEqual(true)
  })

  it('sets isFocussed property to false when the input is blurred', () => {
    wrapper.setData({
      isFocussed: true
    })
    wrapper.find('input').trigger('blur')
    expect(wrapper.vm.isFocussed).toEqual(false)
  })

  it('setEventListener returns true when setting', () => {
    expect(wrapper.vm.setEventListener()).toEqual(true)
  })

  it('setEventListener returns true when already set', () => {
    wrapper.vm.setEventListener()
    expect(wrapper.vm.setEventListener()).toEqual(false)
  })

  it('closes results list when clicked outside the component', () => {
    wrapper.setProps({
      source: [
        {id: 1, name: 'abc'},
        {id: 2, name: 'def'}
      ]
    })
    wrapper.setData({
      display: 'abc'
    })
    wrapper.vm.search()
    expect(wrapper.vm.results).toHaveLength(1)
    document.body.click()
    expect(wrapper.vm.results).toBeFalsy()
  })

  it('clears display value when closing results', () => {
    wrapper.setProps({
      source: [
        {id: 1, name: 'abc'},
        {id: 2, name: 'def'}
      ]
    })
    wrapper.setData({
      display: 'abc'
    })
    wrapper.vm.search()
    document.body.click()
    expect(wrapper.vm.display).toBeNull()
    expect(wrapper.vm.value).toBeNull()
  })

  it('retains initialValue when closing results list', () => {
    wrapper = shallow(Autocomplete, {
      propsData: {
        source: [
          {id: 1, name: 'abc'},
          {id: 2, name: 'def'}
        ],
        initialDisplay: 'def',
        initialValue: 2
      }
    })
    wrapper.setData({
      display: 'abc'
    })
    wrapper.vm.search()
    document.body.click()
    expect(wrapper.vm.display).toEqual('def')
    expect(wrapper.vm.value).toEqual(2)
  })
})
