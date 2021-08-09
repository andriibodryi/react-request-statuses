import { ActionSubTypes } from '../actionCreators/actionCreators.types';
import {
  AsyncActionType,
  Cancel,
  Failure,
  Success,
  Request,
} from '../model/Action';

export type ActionSubscriptionType<T> = (
  onSuccessCallback?: (data?: Success<T>) => void,
  onFailedCallback?: (data?: string) => void,
  onCanceledCallback?: (data?: Cancel<T>) => void,
) => void;

export type ReducedActionPayload<T> =
  | Request<T>
  | Success<T>
  | Failure<T>
  | Cancel<T>;

export interface ReducedActionType<T> {
  status: ActionSubTypes;
  payload: ReducedActionPayload<T>;
  timestamp: number;
}

export interface RequestStatusesReducer<T = AsyncActionType> {
  [props: string]: ReducedActionType<T>;
}
