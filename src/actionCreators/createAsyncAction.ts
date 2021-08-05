import { createAction } from '@reduxjs/toolkit';
import {
  AsyncActionType,
  DefaultPayload,
  ActionID,
  MultiProcessAsyncActionType,
} from '../model';
import { ActionStructure, ACTION_SUBTYPE } from './actionCreators.types';

export const ACTION_DIVIDER = ' ~> ';

const produceActionGenerator = (majorType: string, id: ActionID) =>
  createAction(majorType, (payload) => ({
    payload,
    meta: { id },
  }));

const createActionStructure = <T1, T2, T3, T4>(
  majorType: string,
  id: ActionID,
) =>
  Object.values(ACTION_SUBTYPE).reduce(
    (structure, subType) => ({
      ...structure,
      [subType]: produceActionGenerator(
        `${majorType}${ACTION_DIVIDER}${subType}`,
        id,
      ),
    }),
    {},
  ) as ActionStructure<T1, T2, T3, T4>;

const generateIdStringFromParts = (actionIdParts: ActionID[]) =>
  actionIdParts.reduce(
    (result: string, actionId) =>
      `${result}${result ? ACTION_DIVIDER : ''}${actionId}`,
    '',
  );

const combinePartsToId = (actionIdParts: ActionID[]) => {
  if (actionIdParts.length === 0) {
    return undefined;
  }
  return generateIdStringFromParts(actionIdParts);
};

export const actionCreator =
  <
    T1 = DefaultPayload,
    T2 = DefaultPayload,
    T3 = DefaultPayload,
    T4 = undefined,
  >(
    majorType: string,
  ) =>
  (...actionIdParts: ActionID[]): AsyncActionType<T1, T2, T3, T4> => {
    const id = combinePartsToId(actionIdParts);

    const actionStructure = createActionStructure<T1, T2, T3, T4>(
      majorType,
      id,
    );
    // @ts-ignore
    return {
      ...actionStructure,
      id,
      majorType,
    };
  };

export function createAsyncAction<
  T1 = DefaultPayload,
  T2 = DefaultPayload,
  T3 = DefaultPayload,
  T4 = undefined,
>(majorType: string, options?: undefined): AsyncActionType<T1, T2, T3, T4>;
export function createAsyncAction<
  T1 = DefaultPayload,
  T2 = DefaultPayload,
  T3 = DefaultPayload,
  T4 = undefined,
>(
  majorType: string,
  options: { isMultiInstanceProcess: true },
): MultiProcessAsyncActionType<T1, T2, T3, T4>;
export function createAsyncAction<
  T1 = DefaultPayload,
  T2 = DefaultPayload,
  T3 = DefaultPayload,
  T4 = DefaultPayload,
>(
  majorType: string,
  options: { isMultiInstanceProcess: boolean } | undefined,
):
  | AsyncActionType<T1, T2, T3, T4>
  | MultiProcessAsyncActionType<T1, T2, T3, T4> {
  return options?.isMultiInstanceProcess
    ? actionCreator<T1, T2, T3, T4>(majorType)
    : actionCreator<T1, T2, T3, T4>(majorType)();
}
