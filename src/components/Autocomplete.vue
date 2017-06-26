<template>
  <div class="autocomplete">
    <img v-show="isLoading" class="autocomplete__icon animate-spin" src="../assets/loading.svg">
    <img v-show="isEmpty && !isLoading" class="autocomplete__icon" src="../assets/search.svg">
    <img v-show="!disableInput && !isEmpty && !isLoading" class="autocomplete__icon autocomplete--clear" @click="clearAndFocus" src="../assets/close.svg">

    <input
      v-model="display"
      type="text"
      :placeholder="placeholder"
      :disabled="disableInput"
      :class="inputClass"
      @click="search"
      @input="search"
      @keydown.enter="enter"
      @keydown.tab="close"
      @keydown.up="up"
      @keydown.down="down"
      @keydown.esc="close"
      @focus="focus"
      @blur="blur"
    >
    <input :name="name" type="hidden" :value="value">

    <ul v-show="showResults" class="autocomplete__results" :style="listStyle">
      <li
          v-for="(result, key) in results"
          @click="select(result)"
          class="autocomplete__results__item"
          :class="{'selected' : isSelected(key) }"
      >{{ result.name }}</li>
    </ul>

    <ul v-show="noResults && !isLoading && isFocussed" class="autocomplete__results autocomplete__results--error">
      <li class="autocomplete__results__item">Nothing found.</li>
    </ul>

    <ul v-show="hasError" class="autocomplete__results--error">
      <li class="autocomplete__results__item">{{ error }}</li>
    </ul>

  </div>
</template>

<script type="text/babel">
import axios from 'axios'
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
      results: [],
      selectedIndex: 0,
      loading: false,
      isFocussed: false,
      isRequesting: false,
      lastRequested: null,
      queuedRequest: null,
      error: null,
      selectedId: null,
      selectedDisplay: null
    }
  },
  computed: {
    showResults () {
      return this.results && this.results.length > 0
    },
    noResults () {
      return this.display && this.results.length === 0
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
  watch: {
    display (value) {
      this.display = value
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
          this.debouncedSearch()
          break
        default:
          throw new TypeError()
      }
    },

    debouncedSearch () {
      const debouncedFunction = debounce(this.resourceSearch.bind(this), 500)
      debouncedFunction()
    },

    resourceSearch () {
      if (!this.display) {
        this.results = []
        this.loading = false
        return
      }

      if (this.isRequesting) {
        this.queuedRequest = this.display
        return false
      }
      this.isRequesting = true
      this.lastRequested = this.display

      let promise
      if (this.xhrMethod === 'post') {
        const params = {}
        params[this.xhrSearchParams] = this.display
        promise = axios.post(this.source, params)
      } else {
        promise = axios.get(this.source + this.display)
      }

      promise
        .then((response) => {
          if (response.data) {
            this.results = response.data[this.xhrResultsProperty]
          }
          this.loading = false
          this.isRequesting = false
          this.doQueuedRequest()
        })
        .catch((error) => {
          this.error = '[ERROR] ' + error.status + ': ' + error.statusText
          this.loading = false
          this.isRequesting = false
        })
    },

    doQueuedRequest () {
      if (!this.queuedRequest) {
        return false
      }

      if (this.lastRequested === this.queuedRequest) {
        this.queuedRequest = null
        return false
      }

      this.resourceSearch()
    },

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

      setTimeout(() => {
        this.close()
      }, 100)

      this.$el.querySelector('input').blur()

      this.$emit('selected', {
        value: this.value,
        display: this.display,
        selectedObject: obj
      })
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

      this.close()

      this.$emit('selected', {
        value: null,
        display: null,
        selected: null
      })
    },
    clearAndFocus () {
      this.clear()
      this.$el.querySelector('input').focus()
    },
    close () {
      if (this.display && this.display !== this.display) {
        this.clear()
      }
      this.results = []
      this.error = null
    }
  },
  mounted () {
    this.value = this.initialValue
    this.display = this.initialDisplay

    document.addEventListener('click', (e) => {
      if (this.$el && !this.$el.contains(e.target)) {
        this.close()
      }
    }, false)
  }
}
</script>

<style lang="stylus" scoped>
.autocomplete
  width 100%
  *
    box-sizing border-box
  position relative

  input
    width 100%

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
  &.autocomplete__results__item--error
    color red

.autocomplete__results__item
  padding 7px 10px
  &:hover
    background rgba(0, 180, 255, 0.075)
  &.selected
    background rgba(0, 180, 255, 0.15)

.autocomplete__icon
  fill red
  color green
  position absolute
  right 4px
  top 6px
  line-height 32px
  color #ccc
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
