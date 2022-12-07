export const errorEvent: symbol;
export type EventType = string | symbol;

declare const s: unique symbol;
type S = typeof s;

type ET = [EventType, any[]] | EventType;

type Key<T extends ET> =
  | Extract<T, [EventType, any[]]>[0]
  | Extract<T, EventType>;

type Param<T extends ET, K extends Key<T>> = K extends Extract<T, EventType>
  ? []
  : Extract<T, [K, any[]]>[1];

export type EventEmitter<T extends ET> = {
  [s]: {
    [key in Key<T>]: Param<T, key>;
  }
};

export type Handler<P extends any[]> = (...args: P) => void;
export type ErrorHandler = (err: Error) => void;
export type OffFunction = () => void;

export function create<T extends ET>(): EventEmitter<T>;
export function emit<E extends EventEmitter<ET>, K extends keyof E[S]>(ee: E, key: K, ...args: E[S][K]): void;
export function emitError(ee: EventEmitter<ET>, err: Error): void;
export function on<E extends EventEmitter<ET>, K extends keyof E[S]>(ee: E, key: K, handler: Handler<E[S][K]>): OffFunction;
export function onError(ee: EventEmitter<ET>, handler: ErrorHandler): OffFunction;
export function once<E extends EventEmitter<ET>, K extends keyof E[S]>(ee: E, key: K, handler: Handler<E[S][K]>): OffFunction;
export function onceError(ee: EventEmitter<ET>, handler: ErrorHandler): OffFunction;

export function bindContext(context: any): (func: Function) => Function;

export function createAndBind<T extends ET>(): {
  emit<K extends keyof EventEmitter<T>[S]>(key: K, ...args: EventEmitter<T>[S][K]): void;
  emitError(err: Error): void;
  on<K extends keyof EventEmitter<T>[S]>(key: K, handler: Handler<EventEmitter<T>[S][K]>): OffFunction;
  onError(handler: ErrorHandler): OffFunction;
  once<K extends keyof EventEmitter<T>[S]>(key: K, handler: Handler<EventEmitter<T>[S][K]>): OffFunction;
  onceError(handler: ErrorHandler): OffFunction;
};
