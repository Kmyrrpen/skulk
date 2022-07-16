# sculk
A small set of type-safe utility functions to create a flux-like implementation for your applications. Separate logic from the UI by passing actions to `dispatch()` whilst your flows handle all the logical stuff, **skulk isn't a state management solution**, but works in conjunction with some of them.

## Quick Start
If you've used redux middleware before, it's basically just that in a more smaller scale.
```ts
const flow1 = (action, next, dispatch) => {
  console.log(1);
  return next(action);
}
const flow2 = (action, next, dispatch) => {
  console.log(2);
  return next(action);
}

const dispatch = createChain(flow1, flow2);
dispatch({/*...*/}) // logs 1 and 2!
```

You can also wrap chains inside chains to better organize your flows:
```ts
const chain1 = createChain(flow1, flow2);
const chain2 = createChain(chain1, flow3, flow4);
const dispatch = createChain(chain2, flow5);
// order --> flow1 flow2 flow3 flow4 flow5
```

### creating actions
we also have a watered-down version of createAction from redux toolkit, without the thunks.
```ts
const increment = createAction<number>("increment");
increment(1)
increment("3") // ts will complain btw
```