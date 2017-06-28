<template>
  <div class="autocomplete">
    <div class="autocomplete__box" :class="[inputClass, {'autocomplete__searching' : showResults}]">

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

      <slot name="results">
        <!-- error -->
        <li v-if="hasError" class="autocomplete__results__item autocomplete__results__item--error">{{ error }}</li>

        <!-- results -->
        <li v-if="!hasError"
            v-for="(result, key) in results"
            @click.prevent="select(result)"
            class="autocomplete__results__item"
            :class="{'autocomplete__selected' : isSelected(key) }">
          {{ displayProperty(result) }}
        </li>

        <!-- no results -->
        <li v-if="noResults && !isLoading && isFocussed && !hasError" class="autocomplete__results__item autocomplete__no-results">Nothing found.</li>
      </slot>
    </ul>
  </div>
</template>

<script type="text/babel">
import debounce from 'lodash/debounce'
export default {
  props: {
    /**
     * Data source for the results
     * @type {String|Object}
     */
    source: {
      type: [Object, Array, String],
      required: true
    },
    /**
     * Input placeholder
     * @type {String}
     */
    placeholder: {
      default: 'Search'
    },
    /**
     * Preset starting value
     * @type {String|Number}
     */
    initialValue: {
      type: [String, Number]
    },
    /**
     * Preset starting display value
     * @type {String}
     */
    initialDisplay: {
      type: String
    },
    /**
     * CSS class for the surrounding input div
     * @type {String|Object}
     */
    inputClass: {
      type: [String, Object]
    },
    /**
     * To disable the input
     * @type {Boolean}
     */
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
     * api http method
     */
    apiMethod: {
      type: String,
      default: 'get'
    },
    /**
     * api - property of results array
     * @type {String}
     */
    apiResultsProperty: {
      type: String
    },
    /**
     * Parameter required for the api search query
     * @type {String}
     */
    apiSearchParams: {
      type: String
    },
    /**
     * Results property used as the value
     * @type {String}
     */
    apiResultsValue: {
      type: String,
      default: 'id'
    },
    /**
     * Results property used as the display
     * @type {String}
     */
    apiResultsDisplay: {
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
      selectedDisplay: null,
      eventListener: false
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
          this.objectSearch()
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
      if (this.apiMethod === 'post') {
        const params = {}
        params[this.apiSearchParams] = this.display
        promise = fetch(this.source, params, {method: 'post'})
      } else {
        promise = fetch(this.source + this.display, {method: 'get'})
      }

      this.setEventListener()

      promise
        .then(response => {
          if (response.ok) {
            this.error = null
            return response.json()
          }
          throw new Error('Network response was not ok.')
        })
        .then(response => {
          this.results = this.setResults(response)
          if (this.results.length === 0) {
            this.$emit('noResults', {query: this.display})
          } else {
            this.$emit('results', {results: this.results})
          }
          this.loading = false
        })
        .catch(error => {
          this.error = error.message
          this.loading = false
        })
    }, 200),

    /**
     * Set results property from api response
     * @param {Object|Array} response
     * @return {Array}
     */
    setResults (response) {
      console.log(response, this.apiResultsProperty)
      if (this.apiResultsProperty && response[this.apiResultsProperty]) {
        return response[this.apiResultsProperty]
      }
      if (Array.isArray(response)) {
        return response
      }
      return []
    },

    objectSearch () {
      this.setEventListener()

      if (!this.display) {
        this.results = this.source
        this.$emit('results', {results: this.results})
        this.loading = false
        return true
      }

      this.results = this.source.filter((item) => {
        return item.name.toLowerCase().includes(this.display.toLowerCase())
      })
      // not v.dry :(
      this.$emit('results', {results: this.results})
      this.loading = false
    },

    select (obj) {
      if (!obj) {
        return
      }

      this.setValues(obj)

      this.$emit('selected', {
        value: this.value,
        display: this.display,
        selectedObject: obj
      })

      this.$emit('input', this.value)

      this.close()
    },

    setValues (obj) {
      this.value = (this.apiResultsValue && obj[this.apiResultsValue]) ? obj[this.apiResultsValue] : obj.id
      this.display = (this.apiResultsDisplay && obj[this.apiResultsDisplay]) ? obj[this.apiResultsDisplay] : obj.name
      this.selectedDisplay = this.display
    },

    displayProperty (obj) {
      return (this.apiResultsDisplay && obj[this.apiResultsDisplay]) ? obj[this.apiResultsDisplay] : obj.name
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
      this.clearValues()
      this.results = null
      this.error = null
      this.$emit('clear')
    },
    clearValues () {
      this.display = null
      this.value = null
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
      this.removeEventListener()
      this.$emit('close')
    },
    setEventListener () {
      if (this.eventListener) {
        return false
      }
      this.eventListener = true
      document.addEventListener('click', this.clickOutsideListener, true)
      return true
    },
    removeEventListener () {
      this.eventListener = false
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

.autocomplete__searching
  border-radius 3px 3px 0 0

.autocomplete__inputs
  flex-grow 1
  padding 0 5px
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

.animate-spin
  animation spin 2s infinite linear

@keyframes spin
  from
    transform rotate(0deg)
  to
    transform rotate(360deg)


</style>
