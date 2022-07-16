import { Action } from './createAction';

export type Next = (action: Action<any>) => any;
export type Flow = (action: Action<any>, next: Next, dispatch: Next) => any;
export const end: Next = (action) => action;

export function createChain(...flows: Flow[]) {
  let memoizedRootFlow: Next;
  function createRootFlow(next: Next, dispatch: Next) {
    let rootFlow: Next = next;
    for (let i = flows.length - 1; i >= 0; i--) {
      const temp = rootFlow;
      rootFlow = (action) => flows[i](action, temp, dispatch);
    }
    return rootFlow;
  }

  return function chainDispatch(action: Action<any>, next?: Next, dispatch?: Next) {
    if (!memoizedRootFlow) {
      memoizedRootFlow = createRootFlow(next || end, dispatch || chainDispatch);
    }
    return memoizedRootFlow(action);
  };
}
