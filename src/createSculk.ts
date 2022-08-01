import { ActionCreator, createAction } from './createAction';
import { Flow } from './createChain';

export type Sculk<P = any> = ActionCreator<P> & {
  _flow: Flow<P>;
};

export function isSculk(flow: any): flow is Sculk {
  return Boolean(typeof flow._flow === 'function');
}

export function createSculk<P = void>(type: string, flow: Flow<P>): Sculk<P>;
export function createSculk(type: string, flow: Flow): any {
  const actionCreator = createAction(type);
  //@ts-ignore
  // might be a better way to do this, but ignoring is good for now.
  actionCreator._flow = flow;
  return actionCreator;
}
