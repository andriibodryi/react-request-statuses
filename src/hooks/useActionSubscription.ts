/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { useComponentDidUpdate } from 'react-lifecycle-hook';

import {
  useSuccessPayloadSelector,
  useReasonFailedSelector,
  useIsFailedSelector,
  useIsSuccessSelector,
} from '../selectors';
import { ActionSubscriptionType, ActionTypes } from '../model';

export const useActionSubscription = <T extends ActionTypes<T>>(
  asyncAction: T,
): ActionSubscriptionType<T> => {
  const isFailed = useIsFailedSelector(asyncAction);
  const isSuccess = useIsSuccessSelector(asyncAction);

  return useCallback(
    (onSuccessCallback, onFailedCallback) => {
      const reasonFailedAction = useReasonFailedSelector<T>(asyncAction);
      const successActionPayload = useSuccessPayloadSelector<T>(asyncAction);

      const arrayFailed = Array.isArray(asyncAction) && isFailed;

      useComponentDidUpdate(
        (prevProps) => {
          if (
            ((prevProps.isFailed !== isFailed && isFailed) || arrayFailed) &&
            onFailedCallback
          ) {
            onFailedCallback(reasonFailedAction);
          }
          if (
            prevProps.isSuccess !== isSuccess &&
            isSuccess &&
            onSuccessCallback
          ) {
            onSuccessCallback(successActionPayload);
          }
        },
        { isFailed, isSuccess },
      );
    },
    [asyncAction, isFailed, isSuccess],
  );
};
