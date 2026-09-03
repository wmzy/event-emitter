import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type MockInstance
} from 'vitest';
import {
  on,
  off,
  removeAllListeners,
  setMaxListeners,
  emit,
  create,
  once,
  emitError,
  onError,
  onceError,
  createAndBind
} from '../src';

describe('event-emitter', () => {
  describe('emit', () => {
    it('should emit and call handler', () => {
      const ee = create();
      const handler = vi.fn();
      on(ee, 'a', handler);
      emit(ee, 'a');
      expect(handler).toHaveBeenCalledTimes(1);
      emit(ee, 'a');
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should emit and call handler with params', () => {
      const ee = create();
      const handler = vi.fn();
      on(ee, 'a', handler);
      emit(ee, 'a', 1, 2);
      expect(handler).toHaveBeenCalledWith(1, 2);
      emit(ee, 'a', 3);
      expect(handler).toHaveBeenCalledWith(3);
    });

    it('should on return off function', () => {
      const ee = create();
      const handler = vi.fn();
      const off = on(ee, 'a', handler);
      emit(ee, 'a');
      expect(handler).toHaveBeenCalledTimes(1);
      off();
      emit(ee, 'a');
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should be a no-op when emitting a key with no subscribers', () => {
      const ee = create();
      expect(() => emit(ee, 'missing', 1)).not.toThrow();
    });

    it('should be a no-op when every subscriber has unsubscribed', () => {
      const ee = create();
      const handler = vi.fn();
      on(ee, 'a', handler)();
      emit(ee, 'a', 'x');
      expect(handler).not.toHaveBeenCalled();
    });

    it('should emit multiple times but call handler once (once)', () => {
      const ee = create();
      const handler = vi.fn();
      once(ee, 'a', handler);
      emit(ee, 'a');
      emit(ee, 'a');
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should once return off function', () => {
      const ee = create();
      const handler = vi.fn();
      const off = once(ee, 'a', handler);
      off();
      emit(ee, 'a');
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('should remove only the given handler', () => {
      const ee = create();
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      on(ee, 'a', handler1);
      on(ee, 'a', handler2);
      off(ee, 'a', handler1);
      emit(ee, 'a');
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should remove every handler of a key when no handler is given', () => {
      const ee = create();
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const otherKey = vi.fn();
      on(ee, 'a', handler1);
      on(ee, 'a', handler2);
      on(ee, 'b', otherKey);
      off(ee, 'a');
      emit(ee, 'a');
      emit(ee, 'b');
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
      expect(otherKey).toHaveBeenCalledTimes(1);
    });

    it('should remove every listener of every key when no key is given', () => {
      const ee = create();
      const handlerA = vi.fn();
      const handlerB = vi.fn();
      on(ee, 'a', handlerA);
      on(ee, 'b', handlerB);
      off(ee);
      emit(ee, 'a');
      emit(ee, 'b');
      expect(handlerA).not.toHaveBeenCalled();
      expect(handlerB).not.toHaveBeenCalled();
    });

    it('should be a no-op for a key without listeners', () => {
      const ee = create();
      expect(() => off(ee, 'missing')).not.toThrow();
      expect(() => off(ee, 'missing', () => {})).not.toThrow();
    });

    it('should be a no-op for a handler that was never added', () => {
      const ee = create();
      const handler = vi.fn();
      on(ee, 'a', handler);
      off(ee, 'a', () => {});
      emit(ee, 'a');
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeAllListeners', () => {
    it('should remove every handler of a key', () => {
      const ee = create();
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const otherKey = vi.fn();
      on(ee, 'a', handler1);
      on(ee, 'a', handler2);
      on(ee, 'b', otherKey);
      removeAllListeners(ee, 'a');
      emit(ee, 'a');
      emit(ee, 'b');
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
      expect(otherKey).toHaveBeenCalledTimes(1);
    });

    it('should remove every listener of every key when no key is given', () => {
      const ee = create();
      const handlerA = vi.fn();
      const handlerB = vi.fn();
      on(ee, 'a', handlerA);
      on(ee, 'b', handlerB);
      removeAllListeners(ee);
      emit(ee, 'a');
      emit(ee, 'b');
      expect(handlerA).not.toHaveBeenCalled();
      expect(handlerB).not.toHaveBeenCalled();
    });

    it('should be a no-op for a key without listeners', () => {
      const ee = create();
      expect(() => removeAllListeners(ee, 'missing')).not.toThrow();
    });
  });

  describe('emit error isolation', () => {
    it('should keep calling later handlers when a handler throws', () => {
      const ee = create();
      const errorHandler = vi.fn();
      onError(ee, errorHandler);
      const first = vi.fn();
      const throwing = vi.fn(() => {
        throw new Error('boom');
      });
      const last = vi.fn();
      on(ee, 'a', first);
      on(ee, 'a', throwing);
      on(ee, 'a', last);
      expect(() => emit(ee, 'a')).not.toThrow();
      expect(first).toHaveBeenCalledTimes(1);
      expect(throwing).toHaveBeenCalledTimes(1);
      expect(last).toHaveBeenCalledTimes(1);
    });

    it('should report every collected error to the error channel', () => {
      const ee = create();
      const errorHandler = vi.fn();
      onError(ee, errorHandler);
      const err1 = new Error('one');
      const err2 = new Error('two');
      on(ee, 'a', () => {
        throw err1;
      });
      on(ee, 'a', () => {
        throw err2;
      });
      expect(() => emit(ee, 'a')).not.toThrow();
      expect(errorHandler).toHaveBeenCalledTimes(2);
      expect(errorHandler).toHaveBeenNthCalledWith(1, err1);
      expect(errorHandler).toHaveBeenNthCalledWith(2, err2);
    });

    it('should rethrow the first error when there is no error handler', () => {
      const ee = create();
      const err1 = new Error('first');
      const err2 = new Error('second');
      const last = vi.fn();
      on(ee, 'a', () => {
        throw err1;
      });
      on(ee, 'a', () => {
        throw err2;
      });
      on(ee, 'a', last);
      expect(() => emit(ee, 'a')).toThrow('first');
      expect(last).toHaveBeenCalledTimes(1);
    });
  });

  describe('emitError', () => {
    it('should call error handler when emitError', () => {
      const ee = create();
      const handler = vi.fn();
      onError(ee, handler);
      const e = new Error('no handler');
      emitError(ee, e);
      expect(handler).toHaveBeenCalledWith(e);
    });

    it('should throw error without error handler', () => {
      const ee = create();
      const e = new Error('no handler');
      expect(() => emitError(ee, e)).toThrow('no handler');
    });

    it('should onceError work', () => {
      const ee = create();
      const handler = vi.fn();
      onceError(ee, handler);
      const e = new Error('once error');
      emitError(ee, e);
      expect(handler).toHaveBeenCalledWith(e);
      expect(() => emitError(ee, e)).toThrow('once error');
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('maxListeners', () => {
    let warn: MockInstance;

    beforeEach(() => {
      warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllEnvs();
    });

    it('should not warn at or below the default limit of 10', () => {
      const ee = create();
      for (let i = 0; i < 10; i++) {
        on(ee, 'a', () => {});
      }
      expect(warn).not.toHaveBeenCalled();
    });

    it('should warn once per key when exceeding the default limit', () => {
      const ee = create();
      for (let i = 0; i < 11; i++) {
        on(ee, 'a', () => {});
      }
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain('11');
      expect(warn.mock.calls[0][0]).toContain('a');
      for (let i = 0; i < 5; i++) {
        on(ee, 'a', () => {});
      }
      expect(warn).toHaveBeenCalledTimes(1);
    });

    it('should warn once per key per emitter', () => {
      const ee1 = create();
      const ee2 = create();
      for (let i = 0; i < 11; i++) {
        on(ee1, 'a', () => {});
        on(ee2, 'a', () => {});
        on(ee1, 'b', () => {});
      }
      expect(warn).toHaveBeenCalledTimes(3);
    });

    it('should respect the limit set by setMaxListeners', () => {
      const ee = create();
      setMaxListeners(ee, 2);
      on(ee, 'a', () => {});
      on(ee, 'a', () => {});
      expect(warn).not.toHaveBeenCalled();
      on(ee, 'a', () => {});
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain('3');
    });

    it('should allow disabling the warning with setMaxListeners(ee, 0)', () => {
      const ee = create();
      setMaxListeners(ee, 0);
      for (let i = 0; i < 20; i++) {
        on(ee, 'a', () => {});
      }
      expect(warn).not.toHaveBeenCalled();
    });

    it('should count once() subscriptions like any other', () => {
      const ee = create();
      setMaxListeners(ee, 1);
      once(ee, 'a', () => {});
      once(ee, 'a', () => {});
      expect(warn).toHaveBeenCalledTimes(1);
    });

    it('should expose setMaxListeners on the bound API', () => {
      const bound = createAndBind();
      bound.setMaxListeners(1);
      bound.on('a', () => {});
      bound.on('a', () => {});
      expect(warn).toHaveBeenCalledTimes(1);
    });

    it('should not warn in production', async () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.resetModules();
      const mod = await import('../src');
      const ee = mod.create();
      for (let i = 0; i < 15; i++) {
        mod.on(ee, 'a', () => {});
      }
      expect(warn).not.toHaveBeenCalled();
      vi.resetModules();
    });
  });

  describe('createAndBind', () => {
    it('should create bound event emitter', () => {
      const ee = createAndBind();
      const handler = vi.fn();
      ee.on('a', handler);
      ee.emit('a');
      expect(handler).toHaveBeenCalled();
    });

    it('should remove listeners via bound off', () => {
      const ee = createAndBind();
      const handler = vi.fn();
      const handler2 = vi.fn();
      ee.on('a', handler);
      ee.on('a', handler2);
      ee.off('a', handler);
      ee.emit('a');
      expect(handler).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should remove every handler of a key via bound off without handler', () => {
      const ee = createAndBind();
      const handler = vi.fn();
      ee.on('a', handler);
      ee.off('a');
      ee.emit('a');
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
