function getSet(ee, key) {
  const set = ee.get(key);
  if (set) return set;
  const newSet = new Set();
  ee.set(key, newSet);
  return newSet;
}

// DEV-only listener-leak warning. Checked via process.env.NODE_ENV because the
// build pipeline has no compile-time constant injection; the typeof guard
// keeps direct browser usage of the UMD build safe. In production the whole
// machinery is skipped and `on` only pays one boolean test.
const DEV =
  typeof process !== 'undefined' &&
  process.env &&
  process.env.NODE_ENV !== 'production';

const DEFAULT_MAX_LISTENERS = 10;
const maxListenersMap = new WeakMap();
const warnedKeysMap = new WeakMap();

export function setMaxListeners(ee, n) {
  maxListenersMap.set(ee, n);
}

function checkMaxListeners(ee, key, size) {
  let max = maxListenersMap.get(ee);
  if (max === undefined) max = DEFAULT_MAX_LISTENERS;
  if (max <= 0 || size <= max) return;
  let warnedKeys = warnedKeysMap.get(ee);
  if (!warnedKeys) {
    warnedKeys = new Set();
    warnedKeysMap.set(ee, warnedKeys);
  }
  if (warnedKeys.has(key)) return;
  warnedKeys.add(key);
  // eslint-disable-next-line no-console
  console.warn(
    `Possible event-emitter memory leak: ${size} "${String(
      key
    )}" listeners added. ` +
      `Use setMaxListeners(ee, n) to raise the limit, or 0 to disable this warning.`
  );
}

export const errorEvent = Symbol('error');

export function create() {
  return new Map();
}

// A throwing handler must not stop its peers: errors are collected while the
// remaining handlers still run, then reported through emitError (the
// errorEvent channel). If no error handler is subscribed either, the first
// collected error is rethrown to the emit caller instead of being swallowed.
// Iteration follows Set semantics: a listener added while this emit runs is
// still visited by that same emit, and a listener removed before it is
// visited is skipped. Removing a whole key (off/removeAllListeners) does not
// affect an emit already in flight.
export function emit(ee, key, ...args) {
  const set = ee.get(key);
  if (!set || !set.size) return;
  let errors;
  set.forEach(h => {
    try {
      h(...args);
    } catch (err) {
      if (errors) errors.push(err);
      else errors = [err];
    }
  });
  if (errors) {
    for (const err of errors) {
      emitError(ee, err);
    }
  }
}

export function emitError(ee, err) {
  const handlerSet = ee.get(errorEvent);
  if (!handlerSet || !handlerSet.size) throw err;
  handlerSet.forEach(h => h(err));
}

export function on(ee, key, handler) {
  const set = getSet(ee, key);
  set.add(handler);
  if (DEV) checkMaxListeners(ee, key, set.size);
  return () => set.delete(handler);
}

export function off(ee, key, handler) {
  if (key === undefined) {
    ee.clear();
    return;
  }
  const set = ee.get(key);
  if (!set) return;
  if (handler === undefined) {
    ee.delete(key);
    return;
  }
  set.delete(handler);
}

export function removeAllListeners(ee, key) {
  if (key === undefined) ee.clear();
  else ee.delete(key);
}

export function onError(ee, handler) {
  return on(ee, errorEvent, handler);
}

export function once(ee, key, handler) {
  const off = on(ee, key, (...args) => {
    off();
    handler(...args);
  });
  return off;
}

export function onceError(ee, handler) {
  return once(ee, errorEvent, handler);
}

export function bindContext(context) {
  return func => func.bind(null, context);
}

export function createAndBind() {
  const ee = create();

  const bind = bindContext(ee);

  return {
    emit: bind(emit),
    emitError: bind(emitError),
    on: bind(on),
    off: bind(off),
    onError: bind(onError),
    once: bind(once),
    onceError: bind(onceError),
    setMaxListeners: n => setMaxListeners(ee, n)
  };
}
