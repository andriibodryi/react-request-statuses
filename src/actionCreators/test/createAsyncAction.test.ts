import { ACTION_DIVIDER, createAsyncAction } from '../createAsyncAction';
import { ACTION_SUBTYPE } from '../actionCreators.types';

const ACTION_TYPE = 'DUMMY_ACTION_TYPE';

const ACTION_SUBTYPES = ['REQUEST', 'SUCCESS', 'FAILURE', 'CANCEL'] as const;
const actionTypePattern = (
  majorType: string,
  subType: keyof typeof ACTION_SUBTYPE,
): string => `${majorType}${ACTION_DIVIDER}${subType}`;

describe('createAsyncAction', () => {
  it('creates a single instance async action with given action type', () => {
    const action = createAsyncAction(ACTION_TYPE);

    expect(action.majorType).toBe(ACTION_TYPE);
  });

  it('creates action with major values return string type when called .toString()', () => {
    const action = createAsyncAction(ACTION_TYPE);

    ACTION_SUBTYPES.forEach((subtype) => {
      expect(action[subtype].toString()).toBe(action[subtype]().type);
      expect(action[subtype].toString()).toBe(
        actionTypePattern(ACTION_TYPE, subtype),
      );
    });
  });

  it('creates action with type equal to the type pattern', () => {
    const action = createAsyncAction(ACTION_TYPE);

    expect(action.REQUEST().type).toEqual(
      actionTypePattern(ACTION_TYPE, 'REQUEST'),
    );
    expect(action.SUCCESS().type).toEqual(
      actionTypePattern(ACTION_TYPE, 'SUCCESS'),
    );
    expect(action.FAILURE().type).toEqual(
      actionTypePattern(ACTION_TYPE, 'FAILURE'),
    );
    expect(action.CANCEL().type).toEqual(
      actionTypePattern(ACTION_TYPE, 'CANCEL'),
    );
  });

  it('creates action with given type with payload to be undefined if no payload given', () => {
    const action = createAsyncAction(ACTION_TYPE);

    expect(action.REQUEST().payload).toBeUndefined();
    expect(action.SUCCESS().payload).toBeUndefined();
    expect(action.FAILURE().payload).toBeUndefined();
    expect(action.CANCEL().payload).toBeUndefined();
  });

  it('creates action with given type with payload given', () => {
    const action = createAsyncAction<string, string, string, string>(
      ACTION_TYPE,
    );

    const testPayload = 'test-payload';
    expect(action.REQUEST(testPayload).payload).toBe(testPayload);
    expect(action.SUCCESS(testPayload).payload).toBe(testPayload);
    expect(action.FAILURE(testPayload).payload).toBe(testPayload);
    expect(action.CANCEL(testPayload).payload).toBe(testPayload);
  });
});

describe('createMultiProcessAsyncAction', () => {
  let multipleActionCreator: ReturnType<typeof createAsyncAction>;
  beforeEach(() => {
    multipleActionCreator = createAsyncAction(ACTION_TYPE, {
      isMultiInstanceProcess: true,
    });
  });

  it('returns function when executed', () => {
    expect(typeof multipleActionCreator).toBe('function');
  });

  it('creates action with a single id given', () => {
    const id = 'id';
    const action = multipleActionCreator(id);

    expect(action.id).toBe(id);
  });

  it('creates action with several id given', () => {
    const idPart1 = 'part1';
    const idPart2 = 'part2';
    const combinedId = `${idPart1}${ACTION_DIVIDER}${idPart2}`;

    const action = multipleActionCreator(idPart1, idPart2);

    expect(action.id).toBe(combinedId);
  });
});
