# vuejs-auto-complete

> A Vue autocomplete component

`npm install vuejs-auto-complete --save`

## Usage

Api data source
``` html
<autocomplete
  source="https://api.github.com/search/repositories?q="
  api-results-property="items"
  api-results-display="full_name">
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
| apiSearchParams       | String             |          |           | if http method is `post` this is the property to send query under|
| apiResultsProperty    | String             |          |           | property api results are keyed under|
| apiResultsValue       | String             |          |           | property to use for the `value`|
| apiResultsDisplay     | String             |          |           | property to use for the `display`|
| requestHeaders        | Object             |          |           | extra headers appended to the request|

