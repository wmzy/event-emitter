import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  on,
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

  describe('createAndBind', () => {
    it('should create bound event emitter', () => {
      const ee = createAndBind();
      const handler = vi.fn();
      ee.on('a', handler);
      ee.emit('a');
      expect(handler).toHaveBeenCalled();
    });
  });
});
