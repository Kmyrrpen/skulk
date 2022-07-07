import { Action } from "./createAction";

export type Dispatch = (action: Action<unknown>) => void;
export function createDispatch(...flows: any[]): Dispatch;
export function createDispatch(...flows: any[]) {
  return (action: any) => {
    flows.forEach((flow) => flow(action));
  };
}
