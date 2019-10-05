# Templates

Templates are defined in [Handlebars](https://handlebarsjs.com/) format and are wrapped by `layouts`.

## Named Templates

Each subdirectory under `/templates/templates` is a "named template" which can easily be leveraged
by the `typed-templates` package which is included by default.

```js
const template = TypedTemplate.create()
  .template("example-template")
  .channels("email")
  .substitute({
    subject: "once a foobar, always a foobar")
  });
```
