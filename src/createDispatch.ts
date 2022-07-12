import { Action } from "./createAction";
import { Flow } from "./createChain";

// to not create a lot of these, all next() calls that aren't
// in chains will point to emptyNext
const emptyNext = () => {};

export type Dispatch = (action: Action<unknown>) => void;
export function createDispatch(...flows: Flow[]): Dispatch;
export function createDispatch(...flows: Flow[]) {
  return function dispatch(action: Action<any>) {
    flows.forEach((flow) => {
      if (flow.arguments === 3) {
        flow(action, dispatch, emptyNext);
      } else {
        flow(action, dispatch);
      }
    });
  };
}
