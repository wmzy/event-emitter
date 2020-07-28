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
