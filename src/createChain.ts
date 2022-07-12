import { Action } from "./createAction";
import { Dispatch } from "./createDispatch";

export type Flow = (
  action: Action<any>,
  dispatch: Dispatch,
  next?: Flow
) => void;

export function createChain(...flows: Flow[]) {
  if (flows.length === 0) {
    throw Error("array must not be empty");
  }

  // have the last flow be called with next as an empty func
  let masterFlow: Flow = (action, dispatch) =>
    flows[flows.length - 1](action, dispatch, () => {});
  let tempFlow: Flow = masterFlow;

  for (let i = flows.length - 1; i >= 0; i--) {
    masterFlow = (action, dispatch) => {
      flows[i](action, dispatch, tempFlow);
    };
    tempFlow = masterFlow;
  }

  return function chainDispatch(action: Action<any>, dispatch?: Dispatch) {
    // if dispatch isn't given, reference self instead.
    dispatch = dispatch || chainDispatch;

    // @ts-ignore
    // masterFlow doesn't need next to be passed.
    masterFlow(action, dispatch);
  };
}
