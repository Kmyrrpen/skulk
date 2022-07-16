import { Action } from "./createAction";

export type Next = (action: Action<any>) => any;
export type Flow = (action: Action<any>, dispatch: Next, next: Next) => any;
export const end: Next = (action) => action;

export function createChain(...flows: Flow[]) {
  let memoizedRootFlow: Next;
  function createRootFlow(dispatch: Next, next: Next = end) {
    let rootFlow: Next = next;
    for (let i = flows.length - 1; i >= 0; i--) {
      const temp = rootFlow;
      rootFlow = (action) => flows[i](action, dispatch, temp);
    }
    return rootFlow;
  }

  return function chainDispatch(
    action: Action<any>,
    dispatch?: Next,
    next?: Next
  ) {
    if (!memoizedRootFlow) {
      memoizedRootFlow = createRootFlow(dispatch || chainDispatch, next || end);
    }
    return memoizedRootFlow(action);
  };
}
