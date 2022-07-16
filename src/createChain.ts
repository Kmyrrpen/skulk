import { Action } from "./createAction";

export const end = (action: Action) => action;
export type Dispatch = (action: Action<any>) => void;
export type Next = (action: Action<any>) => any;
export type Flow = (action: Action<any>, dispatch: Dispatch, next: Next) => any;

export function createChain(...flows: Flow[]) {
  let memoizedRootFlow: Next;
  function createRootFlow(dispatch: Dispatch, next: Next = end) {
    let rootFlow: Next = next;
    for (let i = flows.length - 1; i >= 0; i--) {
      const temp = rootFlow;
      rootFlow = (action) => flows[i](action, dispatch, temp);
    }
    return rootFlow;
  }

  return function chainDispatch(
    action: Action<any>,
    dispatch?: Dispatch,
    next?: Next
  ) {
    if (!memoizedRootFlow) {
      memoizedRootFlow = createRootFlow(dispatch || chainDispatch, next || end);
    }
    return memoizedRootFlow(action);
  };
}
