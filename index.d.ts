export type Handler = (...args: unknown[]) => void;
export type ErrorHandler = (err: Error) => void;
export type OffFunction = () => void;
export type EventEmitter<K> = Map<K, Set<Handler>>;
export const errorEvent: Symbol;

export function create<K>(): EventEmitter<K>;
export function emit<K>(ee: EventEmitter<K>, key: K, ...args: unknown[]): void;
export function emitError<K>(ee: EventEmitter<K>, err: Error): void;
export function on<K>(ee: EventEmitter<K>, key: K, handler: Handler): OffFunction;
export function onError<K>(ee: EventEmitter<K>, handler: ErrorHandler): OffFunction;
export function once<K>(ee: EventEmitter<K>, key: K, handler: Handler): OffFunction;
export function onceError<K>(ee: EventEmitter<K>, handler: ErrorHandler): OffFunction;

export function bindContext(context: any): (func: Function) => Function;

export function createAndBind<K>(): {
  emit(key: K, ...args: unknown[]): void;
  emitError(err: Error): void;
  on(key: K, handler: Handler): OffFunction;
  onError(handler: ErrorHandler): OffFunction;
  once(key: K, handler: Handler): OffFunction;
  onceError(handler: ErrorHandler): OffFunction;
};
