/* eslint-disable react-hooks/rules-of-hooks */
import { get, useSelector } from '../utils';
import { ActionSubTypes } from '../actionCreators';
import {
  RequestStatusesReducer,
  ReducedActionType,
  ActionID,
  AsyncActionArrayMaybe,
  ActionTypes,
  AsyncActionType,
  Success,
  Request,
  Failure,
} from '../model';

const requestsStatusesRootSelector = (state: {
  requestStatuses: RequestStatusesReducer;
}): RequestStatusesReducer => state.requestStatuses;

const useRequestsStatusForActionSelector = <T extends ActionTypes<T>>(
  action: T extends AsyncActionType
    ? AsyncActionType
    : { majorType: string; id?: ActionID },
): ReducedActionType<T> =>
  get(
    useSelector(requestsStatusesRootSelector),
    action.id !== undefined
      ? `${action.majorType}.${action.id}`
      : `${action.majorType}`,
  );

const useStatusFromArray = (
  actions: AsyncActionType[],
  subscribedStatus: ActionSubTypes,
  useForEveryAction = true,
) => {
  const requestsData = actions.map((a) =>
    useRequestsStatusForActionSelector(a),
  );

  const method = useForEveryAction ? 'every' : 'some';

  return requestsData[method]((a) => a?.status === subscribedStatus);
};

export const useIsLoadingSelector = (
  action: AsyncActionArrayMaybe,
): boolean => {
  if (Array.isArray(action)) {
    return useStatusFromArray(action, ActionSubTypes.REQUEST, false);
  }
  const requestData = useRequestsStatusForActionSelector(action);

  return requestData?.status === ActionSubTypes.REQUEST;
};

export const useIsAnyLoadingSelector = <T extends AsyncActionType>(
  action: T,
): boolean => {
  // @ts-ignore
  const actionData = useRequestsStatusForActionSelector({
    majorType: action.majorType,
  });

  if (!actionData) {
    return false;
  }
  for (const actionId of Object.keys(actionData)) {
    if (actionData[actionId].status === ActionSubTypes.REQUEST) {
      return true;
    }
  }

  return false;
};

export const useIsSuccessSelector = (
  action: AsyncActionArrayMaybe,
): boolean => {
  if (Array.isArray(action)) {
    return useStatusFromArray(action, ActionSubTypes.SUCCESS);
  }

  const requestData = useRequestsStatusForActionSelector(action);

  return requestData?.status === ActionSubTypes.SUCCESS;
};

export const useIsFailedSelector = (action: AsyncActionArrayMaybe): boolean => {
  if (Array.isArray(action)) {
    return useStatusFromArray(action, ActionSubTypes.FAILURE, false);
  }

  const requestData = useRequestsStatusForActionSelector(action);

  return requestData?.status === ActionSubTypes.FAILURE;
};

export const useReasonFailedSelector = <T extends AsyncActionType>(
  action: T,
): string | undefined => {
  const requestData = useRequestsStatusForActionSelector(action);
  return requestData?.status === ActionSubTypes.FAILURE
    ? requestData.payload?.message
    : '';
};

export const useSuccessPayloadSelector = <T extends AsyncActionType>(
  action: T,
): Success<T> | undefined => {
  const requestData =
    useRequestsStatusForActionSelector<ActionTypes<T>>(action);

  return requestData?.status === ActionSubTypes.SUCCESS
    ? requestData.payload
    : undefined;
};

export const useLoadingPayloadSelector = <T extends AsyncActionType>(
  action: T,
): Request<T> | undefined => {
  const requestData =
    useRequestsStatusForActionSelector<ActionTypes<T>>(action);

  return requestData?.status === ActionSubTypes.REQUEST
    ? requestData.payload
    : undefined;
};

export const useFailedPayloadSelector = <T extends AsyncActionType>(
  action: T,
): Failure<T> | undefined => {
  const requestData =
    useRequestsStatusForActionSelector<ActionTypes<T>>(action);

  return requestData?.status === ActionSubTypes.FAILURE
    ? requestData.payload
    : undefined;
};

export const useIsCanceledSelector = <T extends AsyncActionType>(
  action: T,
): boolean => {
  const requestData =
    useRequestsStatusForActionSelector<ActionTypes<T>>(action);

  return requestData?.status === ActionSubTypes.CANCEL;
};
