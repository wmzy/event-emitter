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
