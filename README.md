# vuejs-auto-complete

> A Vue autocomplete component

`npm install vuejs-auto-complete --save`

## Usage

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

## Available props

| Prop                  | Type               | Required | Default   | Description|
|-----------------------|--------------------|----------|-----------|------------|
| source                | String|Object|Array| true     |           | data source for the results|
| placeholder           | String             |          | 'Search'  | input placeholder|
| initialValue          | String|Number      |          |           | starting value|
| initialDisplay        | String             |          |           | starting display value|
| inputClass            | String|Object      |          |           | css class for the input div|
| disableInput          | Boolean            |          |           | to disable the input|
| name                  | String             |          |           | name attribute for the `value` input|
| resultsProperty       | String             |          |           | property api results are keyed under|
| resultsValue          | String             |          |           | property to use for the `value`|
| resultsDisplay        | String             |          |           | property to use for the `display`|
| requestHeaders        | Object             |          |           | extra headers appended to the request|

