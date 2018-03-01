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
})
