import Vue from 'vue'
import Autocomplete from '@/components/Autocomplete'

function getViewModel (props) {
  const Constructor = Vue.extend(Autocomplete)
  return new Constructor({propsData: props}).$mount()
}

describe('Autocomplete.vue', () => {
  let vm
  beforeEach(() => {
    vm = getViewModel({
      source: []
    })
  })

  it('should render correct contents', () => {
    expect(vm.$el.querySelector('input'))
      .to.be.defined
  })
})
