import s from 'sinon';
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

describe('emit', () => {
  it('should emit and call handler', async () => {
    const ee = create();
    const handler = s.spy();
    on(ee, 'a', handler);
    emit(ee, 'a');
    handler.should.be.called();
    emit(ee, 'a');
    handler.should.be.callCount(2);
  });

  it('should emit and call handler with params', async () => {
    const ee = create();
    const handler = s.spy();
    on(ee, 'a', handler);
    emit(ee, 'a', 1, 2);
    handler.should.be.calledWith(1, 2);
    emit(ee, 'a', 3);
    handler.should.be.calledWith(3);
  });

  it('should on return off', async () => {
    const ee = create();
    const handler = s.spy();
    const off = on(ee, 'a', handler);
    emit(ee, 'a');
    handler.should.be.called();
    off();
    emit(ee, 'a');
    handler.should.be.callCount(1);
  });

  it('should emit multiple and call handler once', async () => {
    const ee = create();
    const handler = s.spy();
    once(ee, 'a', handler);
    emit(ee, 'a');
    emit(ee, 'a');
    handler.should.be.callCount(1);
  });

  it('should once return off', async () => {
    const ee = create();
    const handler = s.spy();
    const off = once(ee, 'a', handler);
    off();
    emit(ee, 'a');
    handler.should.not.be.called();
  });

  it('should emitError work', async () => {
    const ee = create();
    const handler = s.spy();
    onError(ee, handler);
    const e = new Error('no handler');
    emitError(ee, e);
    handler.should.be.calledWith(e);
  });

  it('should throw error without error handler', async () => {
    const ee = create();
    emitError
      .bind(null, ee, new Error('no handler'))
      .should.throw('no handler');
  });

  it('should onceError work', async () => {
    const ee = create();
    const handler = s.spy();
    onceError(ee, handler);
    const e = new Error('no handler');
    emitError(ee, e);
    handler.should.be.calledWith(e);
    emitError.bind(null, ee, e).should.throw('no handler');
    handler.should.be.callCount(1);
  });

  it('should createAndBind work', async () => {
    const ee = createAndBind();
    const handler = s.spy();
    ee.on('a', handler);
    ee.emit('a');
    handler.should.be.called();
  });
});
