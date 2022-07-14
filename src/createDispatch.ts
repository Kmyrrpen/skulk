import { Action } from "./createAction";
import { Flow } from "./createChain";

/* 
  to not create a lot of these, all next() calls that aren't
  in chains will point to emptyNext(). 
  this is so that users can use the same flow in both dispatch and chains
  without changing their functions, throwing an error is meh
*/
export const emptyNext = () => {};

export type Dispatch = (action: Action<any>) => void;
export function createDispatch(...flows: Flow[]): Dispatch;
export function createDispatch(...flows: Flow[]) {
  return function dispatch(action: Action<any>) {
    flows.forEach((flow) => {
      flow(action, dispatch, emptyNext);
    });
  };
}
