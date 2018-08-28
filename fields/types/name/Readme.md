# Name Field

`Object` — Displayed as **firstname lastname** or **firstname middlename lastname** fields in the Admin UI.

```js
  { type: Types.Name }
```

## Options

### `middle`
`Boolean` when `true`, supports `middle name`

## Schema

The name field adds `first`, `last` and `middle`(optional) `String` paths to the schema, as well as a `full` virtual getter and setter.

If it is updated with a string, it will split it into first, middle and last name based on the first/last space.

### `first` `String`
first name

### `last` `String`
last name

### `middle` `String`
middle name

## Virtuals

### `full` `String`
first, middle and last name, concatenated with a space (if all have a value).
The `name.full` setter splits input at the first/last space.
