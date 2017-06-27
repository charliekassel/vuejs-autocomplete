<template>
  <div id="app">
    <h1>Autocomplete Demo</h1>

    <h3>Object source</h3>
    <div class="demo-pane">
      <autocomplete
        :source="[{id:1,name:'abc'},{id:2,name:'def'}]"
        :initial-display="'abc'"
        :initial-value="1"
        @selected="showObjValue">
      </autocomplete>
      <pre>{{ objectSelected }}</pre>
    </div>

    <h3>XHR source - github api demo</h3>
    <div class="demo-pane">
      <autocomplete
        :source="'https://api.github.com/search/repositories?q='"
        xhr-results-property="items"
        @selected="showXHRValue">
      </autocomplete>
      <pre>{{ xhrSelected }}</pre>
    </div>

    <h3>XHR source - VL2</h3>
    <div class="demo-pane">
      <autocomplete
        :source="'http://local-service-video-library.vice.com/keywords/search?query='"
        xhr-results-property="data"
        @selected="showXHRValue">
      </autocomplete>
      <pre>{{ xhrSelected }}</pre>
    </div>

  </div>
</template>

<script>
import Autocomplete from './components/Autocomplete'

export default {
  name: 'app',
  components: {
    Autocomplete
  },
  data () {
    return {
      objectSelected: {},
      xhrSelected: {}
    }
  },
  methods: {
    showObjValue (obj) {
      this.objectSelected = obj
    },
    showXHRValue (obj) {
      console.log(obj)
      this.xhrSelected = obj
    }
  }
}
</script>

<style>
#app {
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
}

input {
  height: 32px;
  font-size: 16px;
  padding: 3px 6px;
}

.demo-pane {
  width: 300px;
  background: #f3f3f3;
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
