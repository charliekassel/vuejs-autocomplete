import Autocomplete from '@/components/Autocomplete'
import {shallow} from '@vue/test-utils'

describe('Renders an input', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Autocomplete, {
      propsData: {
        source: 'localhost'
      }
    })
  })

  it('should render correct contents', () => {
    expect(wrapper.find('input')).toBeTruthy()
  })
})
