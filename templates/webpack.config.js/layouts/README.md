# Layouts

Layouts are used to frame/wrap templates. The `{{body}}` tag in the layout indicates where
the template will be placed.

## By Channel

Layouts are organized by "channels" which can be user defined but if you are using the
`typed-templates` library which included then the channels will include things like:

* sms
* email-html
* email-text

Imagine you want to leverage an email template called "foobar" then you might do the following:

```ts
const template = TypedTemplate.create()
  .template("foobar")
  .channels("email")
  .substitute({
    subject: "once a foobar, always a foobar")
  });
```

This would then look for the layout `layouts/email-html/foobar.hbs` and if it didn't find it would fall back to `layouts/email-html/default.hbs` and finally `layouts/default.hbs`.

> note: because by default "email" has sub-types of "html" and "plain" it will follow both paths

The `template` variable would look like:

```js
{
  email: {
    html: { ... },
    text: { ... }
  }
}
```
