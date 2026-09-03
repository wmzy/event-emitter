[![npm](https://img.shields.io/npm/v/@for-fun/event-emitter)](https://www.npmjs.com/package/@for-fun/event-emitter)
[![Build Status](https://travis-ci.org/wmzy/event-emitter.svg?branch=master)](https://travis-ci.org/wmzy/event-emitter)
[![Coverage Status](https://coveralls.io/repos/github/wmzy/event-emitter/badge.svg?branch=master)](https://coveralls.io/github/wmzy/event-emitter?branch=master)
[![install size](https://packagephobia.now.sh/badge?p=event-emitter)](https://packagephobia.now.sh/result?p=event-emitter)
# event-emitter

> Simple event emitter.

## Install

```bash
npm i @for-fun/event-emitter
```

## Usage

```js
import * as React from 'react';
import {create, on, emit} from '@for-fun/event-emitter';

const emitter = create();

export default function() {
  const [message, setMessage] = React.useState('');
  React.useEffect(() => on(emitter, 'message', setMessage));

  return <div>
    <p>{message}</p>
    <button onClick={() => emit(emitter, 'message', 'hello')}>Click Me</button>
  </div>;
}
```

## Compatibility Note

This lib support [these browsers or devices](.broserslistrc) with [these methods or APIs](.eslintrc.js#L27) pollyfilled.

## Design Note

Wildcard subscriptions (e.g. `on(ee, '*', handler)`) are not supported by design. Path-level or hierarchical subscriptions are a consumer-side concern — for example, react-f0rm builds them on top of this emitter via `onPathEvent`.

## API

### Unsubscribing

`on`/`once` return an `OffFunction` that removes that exact subscription:

```js
const off = on(ee, 'message', handler);
off(); // removes this exact subscription
```

Additionally, `off` and `removeAllListeners` remove listeners in bulk:

```js
off(ee, 'message', handler); // removes one exact subscription
off(ee, 'message'); // removes every 'message' listener
off(ee); // removes every listener of every key
removeAllListeners(ee, 'message'); // same as off(ee, 'message')
removeAllListeners(ee); // same as off(ee)
```

Both are no-ops for keys or handlers that were never subscribed.

### Error isolation in emit

Handlers of one emit are independent: if a handler throws, the remaining
handlers of that same emit still run. The collected errors are reported
one by one to the `errorEvent` channel (`onError`/`onceError`
subscribers). If no error handler is subscribed either, `emit` rethrows
the first collected error, so failures are never silently swallowed:

```js
onError(ee, err => report(err)); // receives every collected error
emit(ee, 'a'); // throws the first error only when no error handler exists
```

### maxListeners (DEV-only warning)

When more than 10 listeners accumulate on one key — a common symptom of a
missing unsubscribe — a `console.warn` fires once per key, in development
only:

```js
setMaxListeners(ee, 20); // raise the limit for this emitter
setMaxListeners(ee, 0); // disable the warning for this emitter
```

The gate is `process.env.NODE_ENV !== 'production'` (also silent when
`process` is unavailable, e.g. the UMD build loaded directly in a
browser). Production builds skip the whole check; `on` only pays a single
boolean test.

## Workflow

```bash
# develop
npm start

# build
npm run build

# test
npm test

# commit changes
npm run commit

# publish
npm publish
```
