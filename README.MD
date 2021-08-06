# React Request Statuses

##Purpose
React Request Statuses gives an ability to avoid a lot of isLoading. statuses in your project and provide the simple API for subscribing on 3 statuses of your async action.

## You can subscribe on the following states:

- isLoading state
- isSuccess state
- Get Failed message
## Code Sample

###Before:
You had to create isLoading status for every action which needs handling in a template.

```js
const initialState: UserReducer = {
  // ...
  user: {
    //...
  },
  isLoading: false,
  isSuccess: false,
  errorMessage: '',
};

export const reducer = createReducer(initialState, {
  [GET_USER_ASYNC.REQUEST.toString()]: (
    state: UserReducer,
    action: ActionType<User>,
  ) => {
    // ...
    state.isSuccess = false;
    state.isLoading = true;
    state.errorMessage = '';
  },
  [GET_USER_ASYNC.SUCCESS.toString()]: (
    state: UserReducer,
    action: ActionType<User>,
  ) => {
    // ...
    state.isSuccess = true;
    state.isLoading = false;
  },
  [GET_USER_ASYNC.FAILURE.toString()]: (
    state: UserReducer,
    action: ActionType<ApiError>,
  ) => {
    // ...
    state.isSuccess = false;
    state.isLoading = false;
    state.errorMessage = action.payload.message;
  },
});
```

###After:
After you no longer need to create an isLoading status, since you have the separate place with registered statuses for all actions.

```js
const initialState: UserReducer = {
  user: {
    // ...
  },
};

export const reducer = createReducer(initialState, {
  [GET_USER_ASYNC.SUCCESS.toString()]: (
    state: UserReducer,
    action: ActionType<User>,
  ) => {
    merge(state.user, action.payload);
  },
});
```
###Components usage:
Now if you are interested in some status of your action,it is simple to subscribe on that in the template.

```js
import React, { useEffect } from "react";
import { useIsLoadingSelector, useIsSuccessSelector, useReasonFailedSelector } from "react-request-statuses";
import { GET_USER_ASYNC } from "@/store/user/actions";

export const SomeComponent = () => {
  const isLoading = useIsLoadingSelector(GET_USER_ASYNC)
  const isSuccess = useIsSuccessSelector(GET_USER_ASYNC)
  const errorMessage = useReasonFailedSelector(GET_USER_ASYNC)

  useEffect(() => {
    if(errorMessage) {
      alert(errorMessage)
    }
  }, [errorMessage])

  useEffect(() => {
    if(isSuccess) {
      alert('Success!')
    }
  }, [isSuccess])

  if(isLoading) {
    return <FullScreenLoader />
  }

  return (
    /// ..
  )
}
```


## Installation

Open a Terminal in the project root and run:

```sh
yarn react-request-statuses
```
or
```sh
npm i react-request-statuses
```


## Setup

- Add requestStatuses to your root reducer.

```js
import { requestStatuses } from 'react-request-statuses';

export const rootReducer = combineReducers({
  requestStatuses, // <- add here
  // ...
})
```

- Then create async action for an action that you need to know a status using `createAsyncAction` from `react-request-statuses`;

```js
import { createAsyncAction } from 'react-request-statuses'; // <- required

export const GET_USER_ASYNC = createAsyncAction(ActionTypes.GET_USER);
```

- Then in a template using `useIsLoadingSelector` you can subscribe to loading state of your action.

```js
import React, { useEffect } from "react";
import { useIsLoadingSelector, useIsSuccessSelector, useReasonFailedSelector } from "react-request-statuses";
import { GET_USER_ASYNC } from "@/store/user/actions";
import { useDispatch } from 'react-redux'

export const SomeComponent = () => {
  const dispatch = useDispatch()

  const isLoading = useIsLoadingSelector(GET_USER_ASYNC) // subscribe here

  useEffect(() => {
    dispatch(GET_USER_ASYNC.REQUEST()) // trigger request
  }, [])


  if(isLoading) {
    return <FullScreenLoader />
  }

  return (
    /// ..
  )
}
```

- Update your Saga with call `SUCCESS` or `FAILURE` statuses of your action.

```js
import { GET_USER_ASYNC } from "@/store/user/actions"
import { api } from "@api"

export function* getUserSaga(): SagaIterator {
  try {
    const userDetails = yield call(api.user.getUser);

    yield put(GET_USER_ASYNC.SUCCESS(userDetails.response)); // <- required
  } catch (error) {
    yield put(GET_USER_ASYNC.FAILURE(error)); // <- required
  }
}
```

## API reference

### useIsLoadingSelector
Allow subscribing to handle isLoading state.
```js
export const SomeComponent = () => {
  const isLoading = useIsLoadingSelector(GET_USER_ASYNC)
  // Also you may subscribe for array of actions
  const isLoading = useIsLoadingSelector([GET_USER_ASYNC, UPDATE_USER_ASYNC])

  return (
    // ...
  )
}
```

### useIsSuccessSelector
Return true if request has been successful
```js
const isSuccess = useIsSuccessSelector(GET_USER_ASYNC)
```

### useIsLoadingSelector
Return success payload

```js
// somewhere
dispatch(GET_USER_ASYNC.SUCCESS({ id: 1, name: 'Jhon' }))
```

```js
const payload = useSuccessPayloadSelector(GET_USER_ASYNC)
// { id: 1, name: 'Jhon' }
```

### useIsFailedSelector
Return true if request has been failed
```js
const isFailed = useIsFailedSelector(GET_USER_ASYNC)
```

### useReasonFailedSelector
Return error message

```js
// somewhere
dispatch(GET_USER_ASYNC.FAILURE({ code: 401, message: 'Unauthorized' }))
```

```js
const errorMessage = useReasonFailedSelector(GET_USER_ASYNC)
// 'Unauthorized'
```

### useActionSubscription
Create the subscription for an action

```js
export const SomeComponent = () => {
  const getUserSubscription = useActionSubscription(GET_USER_ASYNC)

  const successCallback = (successPayload) => {
    //..
  }

  const failedCallback = (errorMessage) => {
    //..
  }

  getUserSubscription(successCallback, failedCallback)

  return (
    // ...
  )
}
```

