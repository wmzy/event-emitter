import {on, emit, create, once, emitError} from '@/index';

const ee = create<'a' | ['b', ['c' | 'd', number]]>();
const s = Symbol();
create<'a' | typeof s | [typeof s, ['']] | ['b', []]>();
// @ts-expect-error
create<'a' | ['b']>();
// @ts-expect-error
create<'a' | ['b']>();

type TEE = typeof ee;
const once1: typeof on<TEE, 'a'> = once<TEE, 'a'>;
// @ts-expect-error
const once2: typeof on<TEE, 'a'> = once<TEE, 'b'>;

on(ee, 'a', () => {})
// @ts-expect-error
on(ee, 'a', (a) => {})

on(ee, 'b', () => {})
on(ee, 'b', (c: 'c' | 'd') => {})
on(ee, 'b', (c: string) => {})
on(ee, 'b', (c: string, n: number) => {})
// @ts-expect-error
on(ee, 'b', (c, d, e) => {})
// @ts-expect-error
on(ee, 'b', (c: 'a') => {})
// @ts-expect-error
on(ee, 'b', (c: 'a') => {})

emit(ee, 'b', 'c', 1);
// @ts-expect-error
emit(ee, 'b', 'c', 1 as string);

// @ts-expect-error
emit(ee, 'a', 0);

emitError(ee, new Error());
// @ts-expect-error
emitError(ee, new Error(), 0);
// @ts-expect-error
emitError(ee, 0);
