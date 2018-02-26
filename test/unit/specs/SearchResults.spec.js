import Autocomplete from '@/components/Autocomplete'
import {shallow} from '@vue/test-utils'

describe('Search Results', () => {
  let wrapper
  beforeEach(() => {

  })

  it('data source can be an array', () => {
    wrapper = shallow(Autocomplete, {
      propsData: {
        source: [
          {id: 1, name: 'abc'},
          {id: 2, name: 'def'}
        ]
      }
    })
    wrapper.setData({
      display: 'abc'
    })
    wrapper.vm.search()
    wrapper.update()

    const items = wrapper.findAll('.autocomplete__results__item')
    expect(items).toHaveLength(1)
    expect(items.at(0).text()).toEqual('abc')
  })
})
