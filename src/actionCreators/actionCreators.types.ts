import { AsyncActionType } from '../model/Action';

export enum ActionSubTypes {
  REQUEST = 'REQUEST',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  CANCEL = 'CANCEL',
}

export const ACTION_SUBTYPE = {
  REQUEST: ActionSubTypes.REQUEST,
  SUCCESS: ActionSubTypes.SUCCESS,
  FAILURE: ActionSubTypes.FAILURE,
  CANCEL: ActionSubTypes.CANCEL,
} as const;

export type ActionStructure<T1, T2, T3, T4> = Omit<
  AsyncActionType<T1, T2, T3, T4>,
  'majorType' | 'id'
>;
