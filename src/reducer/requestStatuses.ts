import { ActionSubTypes } from '../actionCreators';
import {
  ReducedActionPayload,
  ReducedActionType,
  RequestStatusesReducer,
  AnyAction,
} from '../model';
import { ACTION_DIVIDER } from '../actionCreators/createAsyncAction';

const DEFAULT_INITIAL_STATE: RequestStatusesReducer = {};

function reduceAction<T>(
  state: ReducedActionType<T>,
  id: string | undefined,
  status: ActionSubTypes,
  payload: ReducedActionPayload<T>,
): ReducedActionType<T> {
  return id === undefined
    ? {
        status,
        payload,
        timestamp: new Date().getTime(),
      }
    : {
        ...state,
        [id]: {
          status,
          payload,
          timestamp: new Date().getTime(),
        },
      };
}

export const requestStatuses = (
  state = DEFAULT_INITIAL_STATE,
  action: AnyAction,
): RequestStatusesReducer => {
  const [majorType = '', status] = action.type.split(ACTION_DIVIDER);

  switch (status) {
    case ActionSubTypes.REQUEST:
    case ActionSubTypes.SUCCESS:
    case ActionSubTypes.FAILURE:
    case ActionSubTypes.CANCEL:
      return {
        ...state,
        [majorType]: reduceAction(
          state[majorType],
          action.meta?.id,
          status,
          action.payload,
        ),
      };
    default:
      return state;
  }
};
