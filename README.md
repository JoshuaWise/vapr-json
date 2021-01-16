# vapr-json [![Build Status](https://travis-ci.org/JoshuaWise/vapr-json.svg?branch=master)](https://travis-ci.org/JoshuaWise/vapr-json)

## Installation

```bash
npm install --save vapr
npm install --save vapr-json
```

## Usage

This is a convenience plugin that provides basic JSON support for request and response bodies. This allows you to access parsed JSON request bodies at `req.body`, and it allows you to use any JSON-serializable value as a response body (`res.body`).

```js
const jsonPlugin = require('vapr-json');
const app = require('vapr')();
const route = app.get('/foo');

route.use(jsonPlugin());
route.use((req) => {
	if (req.body.someJsonProperty === 'foobar') {
		return [200, [{ foo: 'bar' }]];
	}
});
```

If someone sends a `POST`, `PUT`, or `PATCH` request without a Content-Type header of `application/json` they'll receive `415 Unsupported Media Type`. If someone sends invalid JSON, they'll receive a `400` response. If someone sends an Accept header that doesn't allow a response of `application/json`, they'll receive a `406` response. If someone sends a request of any HTTP method other than `POST`, `PUT`, or `PATCH`, they mustn't send a request body or else they'll receive `413 Payload Too Large`. All responses with non-empty bodies will be serialized as JSON and given a Content-Type of `application/json`.

## Options

### options.encodeNull = *false*

By default, response bodies of `null` will not be serialized as JSON, because they represent "no data" (e.g., for a `204` response). However, if you want to treat `null` the same as any other value, you can set the `encodeNull` option to `true`.

### options.allowAny = *false*

By default, request bodies are only accepted if they're JSON *objects*, not arrays, strings, numbers, booleans, or null. You can set the `allowAny` option to `true` to allow requests to have any JSON value.

### options.allowArrays = *false*

You can set `allowArrays` to `true` to allow request bodies to be JSON arrays, not just objects. This option has no effect when `allowAny` is `true`.
