import Autocomplete from '@/components/Autocomplete'
import {shallow} from '@vue/test-utils'

describe('Results interaction', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Autocomplete, {
      propsData: {
        source: 'localhost'
      }
    })
  })

  it('should format results with default properties', () => {
    let display = wrapper.vm.formatDisplay({id: 1, name: 'abc'})
    expect(display).toEqual('abc')
  })

  it('should format results using a custom property', () => {
    wrapper.setProps({
      resultsDisplay: 'city'
    })
    let display = wrapper.vm.formatDisplay({id: 1, name: 'abc', city: 'London'})
    expect(display).toEqual('London')
  })

  it('should format results using a function', () => {
    wrapper.setProps({
      resultsDisplay: (result) => `${result.id}: ${result.custom}`
    })
    let display = wrapper.vm.formatDisplay({id: 1, name: 'abc', custom: 'bananas'})
    expect(display).toEqual('1: bananas')
  })
})
