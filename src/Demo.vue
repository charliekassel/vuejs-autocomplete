<template>
  <div id="app">

    <autocomplete
          source="https://dev-video-library.viceops.net/api/keywords/search?query="
          api-results-property="data">
        </autocomplete>


    <h1>Autocomplete Demo</h1>

    <div class="demo">
      <h3>Api data source (github api)</h3>
      <p>Using the <em>source</em> prop we can set an api endpoint for the autocomplete to hit.</p>
      <p>If results are returned under a specific key you can set that via <em>apiResultsProperty</em> key</p>

      <div class="example">
        <h5>Example</h5>
        <autocomplete
          source="https://api.github.com/search/repositories?q="
          api-results-property="items"
          api-results-display="full_name"
          @selected="setXHRValue"
          @clear="setXHRValue({})">
        </autocomplete>

        <div class="results" v-if="apiResults">
          <p>Results:</p>
          <pre>{{ apiResults }}</pre>
        </div>

        <code>
    &lt;autocomplete
      source="https://api.github.com/search/repositories?q="
      api-results-property="items"
      api-results-display="full_name"&gt;
    &lt;/autocomplete&gt;
        </code>

      </div>
    </div>


    <div class="demo">
      <h3>Object data source</h3>
      <p>Optionally the data source can be set by an Object.</p>
      <p>If there are any preset values you can define them with <em>initialValue</em> and <em>initialDisplay</em> props</p>
      <div class="example">
        <h5>Example</h5>
        <autocomplete
          :source="[{id:1,name:'abc'},{id:2,name:'def'}]"
          :initial-display="'abc'"
          :initial-value="1"
          @selected="setObjValue"
          @clear="setObjValue({})">
        </autocomplete>

        <div class="results" v-if="objectResults">
          <p>Results:</p>
          <pre>{{ objectResults }}</pre>
        </div>

        <code>
    &lt;autocomplete
      :source="[{id:1,name:'abc'},{id:2,name:'def'}]"
      :initial-display="'abc'"
      :initial-value="1"&gt;
    &lt;/autocomplete&gt;
        </code>
      </div>
    </div>

    <div class="demo">
      <h3>Binding with v-model</h3>
      <p>
        The autocomplete components sets two values on selection: <em>value</em> and <em>display</em>.
        <em>display</em> is used as the input display value and <em>value</em> is used for the selected value.
        By default these are <em>id</em> and <em>name</em>.
      </p>
      <p>When using <em>v-model</em> the <em>value</em> property is bound.</p>
      <div class="example">
        <h5>Example</h5>
        <autocomplete
          :source="[{id:1,name:'abc'},{id:2,name:'def'}]"
          v-model="demo1">
        </autocomplete>

        <div class="results" v-if="demo1">
          <p>Results:</p>
          <pre>{{ demo1 }}</pre>
        </div>

        <code>
    &lt;autocomplete
      :source="[{id:1,name:'abc'},{id:2,name:'def'}]"
      v-model="demo1"&gt;
    &lt;/autocomplete&gt;
        </code>
      </div>
    </div>

    <div class="demo">
      <h3>Overriding results with a <em>slot</em></h3>
      <p>This example is listening to the <em>noResults</em> event to insert html into the default results list.</p>
      <div class="example">
        <autocomplete
          :source="'https://api.github.com/search/users?q='"
          api-results-property="items"
          api-results-display="login"
          @noResults="showAsk"
          @close="ask = null">
          <li v-if="ask" slot="results" class="autocomplete__results__item" @click="create">Click to create a new one</li>
        </autocomplete>

        <code>
    &lt;autocomplete
      :source="'https://api.github.com/search/users?q='"
      api-results-property="items"
      api-results-display="login"
      @noResults="ask = true"&gt;
      &lt;li v-if="ask" slot="results" class="autocomplete__results__item" @click="create"&gt;Click to create a new one&lt;/li&gt;
    &lt;/autocomplete&gt;
        </code>
      </div>
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
      objectResults: null,
      apiResults: null,
      ask: null,
      demo1: null
    }
  },
  methods: {
    setObjValue (obj) {
      this.objectResults = obj
    },
    setXHRValue (obj) {
      this.apiResults = obj
    },
    showAsk (args) {
      this.ask = {
        query: args.query
      }
    },
    create (search) {
      alert('Create item for "' + this.ask.query + '"\n\nBut this is just a demo...')
    }
  }
}
</script>

<style>
#app {
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
  padding: 1em 2em;
}

h3 {
  border-bottom: 1px solid #ccc;
}

h5 {
  text-transform: uppercase;
  margin: 0 0 20px 0;
  color: #999;
}

input {
  height: 2em;
  font-size: 1em;
  padding: .25em;
}

code {
  font-family: Courier, monospace;
  white-space: pre;
  display: block;
  background: #333;
  color:#fff;
  border-radius: 3px;
  margin: 1em 0 0 0;
}

pre {
  font-family: Courier, monospace;
  background: #eee;
  padding: 1em;
  font-size: 0.8em;
}

.demo {
  margin-bottom: 2em;
}

.example {
  padding: 1em;
  border-radius: 3px;
  border: 1px solid #ccc;
}

.results {
  border-top: 1px solid #ccc;
  margin: 1em 0;
  padding: 0 0 1em;
  max-height: 10em;
  overflow: auto;
}

.results p {
  margin-bottom: 0;
}
</style>
