import { Action } from "./createAction";
import { Dispatch, emptyNext } from "./createDispatch";

export type Next = (action: Action<any>) => any;
export type Flow = (action: Action<any>, dispatch: Dispatch, next: Next) => any;

export function createChain(...flows: Flow[]) {
  if (flows.length === 0) {
    throw Error("array must not be empty");
  }

  let memoizedRootFlow: Next;

  function createRootFlow(dispatch: Dispatch) {
    let rootFlow: Next = emptyNext;

    for (let i = flows.length - 1; i >= 0; i--) {
      const temp = rootFlow;
      rootFlow = (action) => flows[i](action, dispatch, temp);
    }

    return rootFlow;
  }

  return function chainDispatch(action: Action<any>, dispatch?: Dispatch) {
    // if dispatch isn't given, reference self instead.
    dispatch = dispatch || chainDispatch;

    // create rootFlow if haven't yet.
    if (!memoizedRootFlow) {
      memoizedRootFlow = createRootFlow(dispatch);
    }

    memoizedRootFlow(action);
  };
}
