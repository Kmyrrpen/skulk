export type Action<P = void> = {
  type: string;
  payload: P;
};

interface BaseActionCreator<P> {
  match: (action: Action<unknown>) => action is Action<P>;
  type: string;
}

interface CreatorPayload<P> extends BaseActionCreator<P> {
  (payload: P): Action<P>;
}
interface CreatorOptionalPayload<P> extends BaseActionCreator<P> {
  (payload?: P): Action<P>;
}
interface CreatorEmptyPayload<P> extends BaseActionCreator<P> {
  (): Action<P>;
}

export type ActionCreator<P> = [void] extends [P]
  ? CreatorEmptyPayload<P> // payload is void
  : [undefined] extends [P]
  ? CreatorOptionalPayload<P> // payload can be undefined
  : CreatorPayload<P>; // payload is never undefined

export function createAction<P = void>(type: string): ActionCreator<P>;
export function createAction(type: string): any {
  function actionCreator(...args: any[]) {
    return {
      type,
      payload: args[0],
    };
  }

  actionCreator.match = (action: Action<unknown>) => action.type === type;
  actionCreator.type = type;

  return actionCreator;
}