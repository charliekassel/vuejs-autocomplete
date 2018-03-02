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

  it('should navigate through the results list', () => {
    wrapper.setData({
      results: [
        {id: 1, name: 'abc'},
        {id: 2, name: 'def'},
        {id: 3, name: 'ghi'}
      ]
    })
    wrapper.vm.down()
    expect(wrapper.vm.results[wrapper.vm.selectedIndex].id).toEqual(1)
    wrapper.vm.down()
    expect(wrapper.vm.results[wrapper.vm.selectedIndex].id).toEqual(2)
    wrapper.vm.down()
    wrapper.vm.down()
    expect(wrapper.vm.results[wrapper.vm.selectedIndex].id).toEqual(1)
    wrapper.vm.up()
    expect(wrapper.vm.results[wrapper.vm.selectedIndex].id).toEqual(3)
  })

  it('should navigate through the results list via keydown', () => {
    wrapper.setData({
      results: [
        {id: 1, name: 'abc'},
        {id: 2, name: 'def'},
        {id: 3, name: 'ghi'}
      ]
    })
    const input = wrapper.find('input')
    input.trigger('keydown.down')
    expect(wrapper.vm.results[wrapper.vm.selectedIndex].id).toEqual(1)
    input.trigger('keydown.up')
    expect(wrapper.vm.results[wrapper.vm.selectedIndex].id).toEqual(3)
  })

  it('should focus on the last results when initial calling up', () => {
    wrapper.setData({
      results: [
        {id: 1, name: 'abc'},
        {id: 2, name: 'def'},
        {id: 3, name: 'ghi'}
      ]
    })
    wrapper.vm.up()
    expect(wrapper.vm.results[wrapper.vm.selectedIndex].id).toEqual(3)
  })

  it('clears results', () => {
    wrapper.setProps({
      source: [
        {id: 1, name: 'abc'},
        {id: 2, name: 'def'},
        {id: 3, name: 'ghi'}
      ]
    })
    wrapper.setData({
      display: 'abc'
    })
    wrapper.vm.search()
    wrapper.vm.clear()
    expect(wrapper.vm.display).toBeNull()
    expect(wrapper.vm.value).toBeNull()
    expect(wrapper.vm.results).toBeNull()
    expect(wrapper.vm.error).toBeNull()
    expect(wrapper.emitted().clear).toBeTruthy()
  })

  it('selects a result', () => {
    wrapper.vm.select({id: 1, name: 'abc'})
    expect(wrapper.vm.value).toEqual(1)
    expect(wrapper.vm.display).toEqual('abc')
    expect(wrapper.vm.selectedDisplay).toEqual('abc')
    expect(wrapper.emitted().selected).toBeTruthy()
    expect(wrapper.emitted().selected[0][0].value).toEqual(1)
    expect(wrapper.emitted().selected[0][0].display).toEqual('abc')
  })

  it('does not select nothing', () => {
    expect(wrapper.vm.select()).toBeFalsy
  })

  it('selects when enter is pressed', () => {
    wrapper.setData({
      results: [
        {id: 1, name: 'abc'},
        {id: 2, name: 'def'},
        {id: 3, name: 'ghi'}
      ]
    })
    const input = wrapper.find('input')
    input.trigger('keydown.down')
    input.trigger('keydown.enter')
    expect(wrapper.vm.value).toEqual(1)
    expect(wrapper.emitted().enter[0][0]).toEqual('abc')
  })

  it('emits an event when nothing is selected', () => {
    const input = wrapper.find('input')
    input.trigger('keydown.enter')
    expect(wrapper.emitted().nothingSelected).toBeTruthy()
  })
})
