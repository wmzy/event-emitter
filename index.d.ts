export const errorEvent: symbol;
export type EventType = string | symbol;

declare const s: unique symbol;
type S = typeof s;

type ET = [EventType, any[]] | EventType;

type Key<T extends ET> =
  | Extract<T, [EventType, any[]]>[0]
  | Extract<T, EventType>;

type Param<T extends ET, K extends Key<T>> = [K] extends [Extract<T, EventType>]
  ? []
  : Extract<T, [K, any[]]>[1];

export type EventEmitter<T extends ET = [any, any[]]> = {
  [s]: T
};

export type Handler<P extends any[]> = (...args: P) => any;
export type ErrorHandler = (err: Error) => any;
export type OffFunction = () => void;

export function create<T extends ET = [any, any[]]>(): EventEmitter<T>;
export function emit<E extends EventEmitter<any>, const K extends Key<E[S]>>(ee: E, key: K, ...args: Param<E[S], K>): void;
export function emitError(ee: EventEmitter<any>, err: Error): void;
export function on<E extends EventEmitter<any>, const K extends Key<E[S]>>(ee: E, key: K, handler: Handler<Param<E[S], K>>): OffFunction;
export function off(ee: EventEmitter<any>): void;
export function off<E extends EventEmitter<any>, const K extends Key<E[S]>>(ee: E, key: K, handler?: Handler<Param<E[S], K>>): void;
export function removeAllListeners(ee: EventEmitter<any>): void;
export function removeAllListeners<E extends EventEmitter<any>, const K extends Key<E[S]>>(ee: E, key: K): void;
export function onError(ee: EventEmitter<any>, handler: ErrorHandler): OffFunction;
export function once<E extends EventEmitter<any>, const K extends Key<E[S]>>(ee: E, key: K, handler: Handler<Param<E[S], K>>): OffFunction;
export function onceError(ee: EventEmitter<any>, handler: ErrorHandler): OffFunction;
export function setMaxListeners(ee: EventEmitter<any>, maxListeners: number): void;

export function bindContext(context: any): (func: Function) => Function;

export function createAndBind<T extends ET = [any, any[]]>(): {
  emit<const K extends Key<T>>(key: K, ...args: Param<T, K>): void;
  emitError(err: Error): void;
  on<const K extends Key<T>>(key: K, handler: Handler<Param<T, K>>): OffFunction;
  off(key?: Key<T>, handler?: Handler<any[]>): void;
  onError(handler: ErrorHandler): OffFunction;
  once<const K extends Key<T>>(key: K, handler: Handler<Param<T, K>>): OffFunction;
  onceError(handler: ErrorHandler): OffFunction;
  setMaxListeners(maxListeners: number): void;
};
