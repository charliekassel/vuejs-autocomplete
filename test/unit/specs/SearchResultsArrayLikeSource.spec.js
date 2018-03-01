import Autocomplete from '@/components/Autocomplete'
import {shallow} from '@vue/test-utils'

describe('Search Results - Array Like', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Autocomplete, {
      propsData: {
        source: [
          {id: 1, name: 'abc'},
          {id: 2, name: 'def'}
        ]
      }
    })
  })

  it('data source can be an array', () => {
    wrapper.setData({
      display: 'abc'
    })
    wrapper.vm.search()
    wrapper.update()

    const items = wrapper.findAll('.autocomplete__results__item')
    expect(items).toHaveLength(1)
    expect(items.at(0).text()).toEqual('abc')
  })

  it('shows all results when data source is an array and search is empty', () => {
    wrapper.setData({
      display: ''
    })
    wrapper.vm.search()
    wrapper.update()

    const items = wrapper.findAll('.autocomplete__results__item')
    expect(items).toHaveLength(2)
  })

  it('emits results', () => {
    wrapper.vm.search()
    expect(wrapper.emitted().results).toBeTruthy()
  })
})
