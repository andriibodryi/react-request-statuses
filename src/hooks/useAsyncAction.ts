import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AsyncActionType } from '../model';

export const useAsyncAction = <T1, T2, T3, T4>(
  asyncAction: AsyncActionType<T1, T2, T3, T4>,
): ((data?: T1) => void) => {
  const dispatch = useDispatch();
  return useCallback(
    (data?: T1) => {
      dispatch(asyncAction.REQUEST(data));
    },
    [asyncAction, dispatch],
  );
};
