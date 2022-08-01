import { Action } from './createAction';
import { isSculk, Sculk } from './createSculk';

export type Next = (action: Action<any>) => any;
export type Flow<P = any> = (action: Action<P>, next: Next, dispatch: Next) => any;
export const end: Next = (action) => action;

export function createChain(...flows: (Flow | Sculk)[]) {
  let memoizedRootFlow: Next;
  function createRootFlow(next: Next, dispatch: Next) {
    let rootFlow: Next = next;
    for (let i = flows.length - 1; i >= 0; i--) {
      const temp = rootFlow;
      const currFlow = flows[i];
      if(isSculk(currFlow)) {
        // check if action matches sculk
        rootFlow = (action) => {
          if(currFlow.match(action)) {
            // if so call the flow in sculk
            return currFlow._flow(action, temp, dispatch)
          } // else just call next
          return temp(action)
        }
      } else {
        rootFlow = (action) => flows[i](action, temp, dispatch);
      }
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
