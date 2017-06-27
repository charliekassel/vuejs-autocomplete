<template>
  <div class="autocomplete">
    <div class="autocomplete__box" :class="inputClass">

      <img v-if="!isLoading" class="autocomplete__icon" src="../assets/search.svg">
      <img v-else class="autocomplete__icon animate-spin" src="../assets/loading.svg">

      <div class="autocomplete__inputs">
        <input
          v-model="display"
          type="text"
          :placeholder="placeholder"
          :disabled="disableInput"
          @click="search"
          @input="search"
          @keydown.enter="enter"
          @keydown.tab="close"
          @keydown.up="up"
          @keydown.down="down"
          @keydown.esc="close"
          @focus="focus"
          @blur="blur">
        <input :name="name" type="hidden" :value="value">
      </div>

      <img v-show="!disableInput && !isEmpty && !isLoading && !hasError" class="autocomplete__icon autocomplete--clear" @click="clear" src="../assets/close.svg">
    </div>

    <ul v-show="showResults" class="autocomplete__results" :style="listStyle">
      <!-- error -->
      <li v-if="hasError" class="autocomplete__results__item autocomplete__results__item--error">{{ error }}</li>

      <!-- results -->
      <li v-if="!hasError"
          v-for="(result, key) in results"
          @click.prevent="select(result)"
          class="autocomplete__results__item"
          :class="{'autocomplete__selected' : isSelected(key) }">
        {{ result.name }}
      </li>

      <!-- no results -->
      <li v-if="noResults && !isLoading && isFocussed && !hasError" class="autocomplete__results__item">Nothing found.</li>
    </ul>
  </div>
</template>

<script type="text/babel">
import debounce from 'lodash/debounce'
export default {
  props: {
    initialValue: {
      type: [String, Number]
    },
    initialDisplay: {
      type: String
    },
    selected: {
      required: false
    },
    source: {
      type: [Object, Array, String],
      required: true
    },
    placeholder: {
      default: 'Search'
    },
    inputClass: {
      type: [String, Object]
    },
    disableInput: {
      type: Boolean
    },
    /**
     * name property of the input holding the selected value
     * @type {String}
     */
    name: {
      type: String
    },
    /**
     * XHR method
     */
    xhrMethod: {
      type: String,
      default: 'get'
    },
    /**
     * XHR - property of results array
     * @type {String}
     */
    xhrResultsProperty: {
      type: String
    },
    /**
     * Parameter required for the xhr search query
     * @type {String}
     */
    xhrSearchParams: {
      type: String
    },
    /**
     * Results property used as the value
     * @type {String}
     */
    xhrResultsValue: {
      type: String,
      default: 'id'
    },
    /**
     * Results property used as the display
     * @type {String}
     */
    xhrResultsDisplay: {
      type: String,
      default: 'name'
    }
  },
  data () {
    return {
      value: null,
      display: null,
      results: null,
      selectedIndex: 0,
      loading: false,
      isFocussed: false,
      error: null,
      selectedId: null,
      selectedDisplay: null
    }
  },
  computed: {
    showResults () {
      return Array.isArray(this.results) || this.hasError
    },
    noResults () {
      return Array.isArray(this.results) && this.results.length === 0
    },
    isEmpty () {
      return !this.display
    },
    isLoading () {
      return this.loading === true
    },
    hasError () {
      return this.error !== null
    },
    listStyle () {
      if (this.isLoading) {
        return {
          color: '#ccc'
        }
      }
    }
  },
  methods: {
    focus () {
      this.isFocussed = true
    },
    blur () {
      this.isFocussed = false
    },
    isSelected (key) {
      return key === this.selectedIndex
    },
    search () {
      switch (typeof this.source) {
        case 'string':
          // No resource search with no input
          if (!this.display || this.display.length < 1) {
            return
          }
          this.loading = true
          this.resourceSearch()
          break
        case 'object':
          this.loading = true
          this.resourceSearch
          break
        default:
          throw new TypeError()
      }
    },

    resourceSearch: debounce(function () {
      if (!this.display) {
        this.results = []
        this.loading = false
        return
      }

      let promise
      if (this.xhrMethod === 'post') {
        const params = {}
        params[this.xhrSearchParams] = this.display
        promise = fetch(this.source, params, {method: 'post'})
      } else {
        promise = fetch(this.source + this.display, {method: 'get'})
      }

      promise
        .then(response => {
          if (response.ok) {
            this.error = null
            return response.json()
          }
          throw new Error('Network response was not ok.')
        })
        .then(response => {
          if (response[this.xhrResultsProperty]) {
            this.results = response[this.xhrResultsProperty]
          }
          this.loading = false
        })
        .catch(error => {
          this.error = error.message
          this.loading = false
        })
    }, 200),

    objectSearch () {
      if (!this.display) {
        this.results = this.source
        this.loading = false
        return true
      }

      this.results = this.source.filter((item) => {
        return item.name.toLowerCase().includes(this.display.toLowerCase())
      })

      this.loading = false
    },

    select (obj) {
      if (!obj) {
        return
      }

      this.value = obj.id
      this.display = obj.name
      this.selectedDisplay = obj.name

      this.$emit('selected', {
        value: this.value,
        display: this.display,
        selectedObject: obj
      })

      setTimeout(() => {
        this.close()
      }, 100)
    },
    up () {
      this.selectedIndex = (this.selectedIndex === 0) ? this.results.length - 1 : this.selectedIndex - 1
    },
    down () {
      this.selectedIndex = (this.selectedIndex === this.results.length - 1) ? 0 : this.selectedIndex + 1
    },
    enter () {
      this.select(this.results[this.selectedIndex])
    },
    clear () {
      this.display = null
      this.value = null
      this.results = null
      this.error = null

      this.$emit('selected', {
        value: null,
        display: null,
        selected: null
      })
    },
    close () {
      if (!this.value || !this.selectedDisplay) {
        this.clear()
      }
      if (this.selectedDisplay !== this.display && this.value) {
        this.display = this.selectedDisplay
      }

      this.results = null
      this.error = null
      document.removeEventListener('click', this.clickOutsideListener, true)
    },
    clickOutsideListener (event) {
      if (this.$el && !this.$el.contains(event.target)) {
        this.close()
      }
    }
  },
  mounted () {
    this.value = this.initialValue
    this.display = this.initialDisplay
    this.selectedDisplay = this.initialDisplay
  }
}
</script>

<style lang="stylus">
.autocomplete
  position relative
  width 100%
  *
    box-sizing border-box

.autocomplete__box
  display flex
  align-items center
  background #fff
  border: 1px solid #ccc
  border-radius 3px
  padding 0 5px


.autocomplete__inputs
  flex-grow 1
  input
    width 100%
    border 0
    &:focus
      outline none

.autocomplete--clear
  cursor pointer

.autocomplete__results
  margin 0
  padding 0
  list-style-type none
  z-index 1000
  position absolute
  max-height 400px
  overflow-y auto
  background white
  width 100%
  border 1px solid #ccc
  border-top 0
  color black

.autocomplete__results__item--error
  color red

.autocomplete__results__item
  padding 7px 10px
  &:hover
    background rgba(0, 180, 255, 0.075)
  &.autocomplete__selected
    background rgba(0, 180, 255, 0.15)

.autocomplete__icon

  height 14px
  width 14px
  // margin 0 6px

.animate-spin
  animation spin 2s infinite linear

@keyframes spin
  from
    transform rotate(0deg)
  to
    transform rotate(360deg)


</style>
