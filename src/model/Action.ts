import { Action } from 'redux';

export interface AnyAction extends Action {
  [extraProps: string]: any;
}

export interface ApiError {
  code: number;
  message?: string;
}

type AnyType = { type: string };

export type Meta = { id: ActionID };

export type ActionType<P = AnyType> = PayloadAction<P>;

export type MultiProcessActionType<P = AnyType, M = Meta> = PayloadAction<
  P,
  string,
  M
>;

export type IsMultiInstanceProcess = boolean | undefined;

export type ActionID = string | number | null | undefined;

export type DefaultPayload = any;

export type MultiProcessAsyncActionType<T1, T2, T3, T4> = (
  ...actionIdParts: ActionID[]
) => AsyncActionType<T1, T2, T3, T4>;

export type AsyncAction<P = AnyType, M = Meta> = (
  payload?: P,
) => PayloadAction<P, string, M>;

export type Success<T> = T extends { SUCCESS: (payload: infer S) => void }
  ? S
  : never;
export type Request<T> = T extends { REQUEST: (payload: infer R) => void }
  ? R
  : never;
export type Failure<T> = T extends { FAILURE: (payload: infer E) => void }
  ? E
  : ApiError;
export type Cancel<T> = T extends { REQUEST: (payload: infer C) => void }
  ? C
  : never;

export type AsyncActionType<
  T1 = DefaultPayload,
  T2 = DefaultPayload,
  T3 = DefaultPayload,
  T4 = DefaultPayload,
  M = Meta,
> = {
  REQUEST: AsyncAction<T1, M>;
  SUCCESS: AsyncAction<T2, M>;
  FAILURE: AsyncAction<T3, M>;
  CANCEL: AsyncAction<T4, M>;
  majorType: string;
  id: ActionID;
};
export type ActionTypes<T> = AsyncActionType<
  Request<T>,
  Success<T>,
  Failure<T>,
  Cancel<T>
>;

export type AsyncActionArrayMaybe = AsyncActionType | AsyncActionType[];

export type PayloadAction<
  P = void,
  T extends string = string,
  M = never,
  E = never,
> = {
  payload: P;
  type: T;
} & ([M] extends [never]
  ? {}
  : {
      meta: M;
    }) &
  ([E] extends [never]
    ? {}
    : {
        error: E;
      });
