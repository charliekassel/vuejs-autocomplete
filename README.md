# vuejs-auto-complete

[![Travis Build](https://img.shields.io/travis/charliekassel/vuejs-autocomplete.svg?branch=master)](https://travis-ci.org/charliekassel/vuejs-autocomplete?branch=master)
[![Version](https://img.shields.io/npm/v/vuejs-auto-complete.svg)](https://www.npmjs.com/package/vuejs-auto-complete)
[![Coveralls github](https://img.shields.io/coveralls/github/charliekassel/vuejs-autocomplete.svg)](https://coveralls.io/github/charliekassel/vuejs-autocomplete?branch=master)
[![Downloads](https://img.shields.io/npm/dm/vuejs-auto-complete.svg)](https://www.npmjs.com/package/vuejs-auto-complete)

> A Vue autocomplete component

`npm install vuejs-auto-complete --save`

## Usage

Installation, add autocomplete component into your app

```javascript
import Vue from 'vue'
import Autocomplete from 'vuejs-auto-complete'

new Vue({
  //...
  components: {
    Autocomplete,
  },
  //...
})
```

Api data source
``` html
<autocomplete
  source="https://api.github.com/search/repositories?q="
  results-property="items"
  results-display="full_name">
</autocomplete>
```

Object data source
``` html
<autocomplete
  :source="[{id:1,name:'abc'},{id:2,name:'def'}]">
</autocomplete>
```

Full featured example
``` html
<autocomplete
  ref="autocomplete"
  placeholder="Search Distribution Groups"
  :source="distributionGroupsEndpoint"
  input-class="form-control"
  results-property="data"
  :results-display="formattedDisplay"
  :request-headers="authHeaders"
  @selected="addDistributionGroup">
</autocomplete>
```
``` javascript
// parent component
computed: {
  authHeaders () {
    return {
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1Ni....'
    }
  },
},
methods: {
  distributionGroupsEndpoint (input) {
    return process.env.API + '/distribution/search?query=' + input
  },
  addDistributionGroup (group) {
    this.group = group
    // access the autocomplete component methods from the parent
    this.$refs.autocomplete.clear()
  },
  authHeaders () {
    return {
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1Ni....'
    }
  },
  formattedDisplay (result) {
    return result.name + ' [' + result.groupId + ']'
  }
}
```
## Available props

| Prop                  | Type                        | Required | Default   | Description |
|-----------------------|-----------------------------|----------|-----------|-------------|
| source                | String\|Function\|Object\|Array |          | true      | data source for the results|
| method                | String                      |          | 'get'     | http method for api requests|
| placeholder           | String                      |          | 'Search'  | input placeholder|
| initialValue          | String\|Number              |          |           | starting value|
| initialDisplay        | String                      |          |           | starting display value|
| inputClass            | String\|Object              |          |           | css class for the input div|
| disableInput          | Boolean                     |          |           | to disable the input|
| name                  | String                      |          |           | name attribute for the `value` input|
| resultsFormatter      | Function<Object[]>          |          |           | Function to format the server data. Should return an array of objects with id and name properties |
| resultsProperty       | String                      |          |           | property api results are keyed under|
| resultsValue          | String                      |          | 'id'      | property to use for the `value`|
| resultsDisplay        | String\|Function            |          | 'name'    | property to use for the `display` or custom function|
| requestHeaders        | Object                      |          |           | extra headers appended to the request|
| showNoResults         | Boolean                     |          | true      | To show a message that no results were found|
| clearButtonIcon       | String                      |          |           | Optionally provide an icon css class|
| maxlength             | Number                      |          |           | Optional max input length|

## Available events

| Event    | Output         | Description |
|----------|----------------|-------------|
| results  | Object         | Results returned from a search |
| noResults| Object         | When no results are returned |
| selected | Object         | When an item is selected |
| input    | String\|Number | The value when an item is selected |
| clear    |                | When selected results are cleared |
| close    |                | When the options list is closed |
| enter    | String         | Emits the input value when enter is pressed |
| nothingSelected | String  | Emits the input value when enter is pressed and nothing was selected |

## Available Slots

| Slot        | Description |
|-------------|-------------|
| firstResult | list item placed before all results |
| lastResult  | list item placed at the end of the results |
| noResults   | list item shown when no results are present |
