function getSet(ee, key) {
  const set = ee.get(key);
  if (set) return set;
  const newSet = new Set();
  ee.set(key, newSet);
  return newSet;
}

export const errorEvent = Symbol('error');

export function create() {
  return new Map();
}

export function emit(ee, key, ...args) {
  (ee.get(key) || []).forEach(h => h(...args));
}

export function emitError(ee, ...args) {
  emit(ee, errorEvent, ...args);
}

export function on(ee, key, handler) {
  const set = getSet(ee, key);
  set.add(handler);
  return () => set.delete(handler);
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
    onError: bind(onError),
    once: bind(once),
    onceError: bind(onceError)
  };
}
