/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { useComponentDidUpdate } from 'react-lifecycle-hook';

import {
  useSuccessPayloadSelector,
  useReasonFailedSelector,
  useIsFailedSelector,
  useIsSuccessSelector,
  useIsCanceledSelector,
} from '../selectors';
import { ActionSubscriptionType, ActionTypes } from '../model';

export const useActionSubscription = <T extends ActionTypes<T>>(
  asyncAction: T,
): ActionSubscriptionType<T> => {
  const isFailed = useIsFailedSelector(asyncAction);
  const isSuccess = useIsSuccessSelector(asyncAction);
  const isCanceled = useIsCanceledSelector(asyncAction);

  return useCallback(
    (onSuccessCallback, onFailedCallback, onCanceledCallback) => {
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

          if (
            prevProps.isCanceled !== isCanceled &&
            isCanceled &&
            onCanceledCallback
          ) {
            onCanceledCallback();
          }
        },
        { isFailed, isSuccess, isCanceled },
      );
    },
    [asyncAction, isFailed, isSuccess, isCanceled],
  );
};
