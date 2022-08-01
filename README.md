# sculk

A small set of type-safe utility functions to create a flux-like implementation for your applications. Separate logic from the UI by passing actions to `dispatch()` whilst your flows handle all the logical stuff, **skulk isn't a state management solution**, but works in conjunction with some of them.

## Quick Start

If you've used redux middleware before, it's basically just that in a more smaller scale.

```ts
const flow1 = (action, next, dispatch) => {
  console.log(1);
  return next(action);
};
const flow2 = (action, next) => {
  console.log(2);
  return next(action);
};

const dispatch = createChain(flow1, flow2);
dispatch({
  /*...*/
}); // logs 1 and 2!
```

You can also wrap chains inside chains to better organize your flows:

```ts
const chain1 = createChain(flow1, flow2);
const chain2 = createChain(chain1, flow3, flow4);
const dispatch = createChain(chain2, flow5);
// order --> flow1 flow2 flow3 flow4 flow5
```

Note that you should **NOT** call a chain if it's going to be passed again to another chain

```ts
const chain1 = createChain(flow1, flow2);
chain1({
  /*...*/
});
const chain2 = createChain(chain1, flow3, flow4); // will not work as expected!
```

## Creating Actions

we also have a watered-down version of `createAction` from redux toolkit, without the thunks.

```ts
const increment = createAction<number>('increment');
const decrement = createAction<string>('decrement');
const action = increment(1);

// match the actions:
console.log(increment.match(action)) // true
console.log(decrement.match(action)) // false
```

## Creating Sculks

I found it tedious to create an action and a flow that only responds to said action, as well as having to check if that action is said action, so why not combine them together?

Sculks act as action creators if called and act like flows if passed to `createChain`.

```ts
const increment = createSculk<number>("increment", (action, next) => {
  // actions are already checked under the hood, no need to match them.
  console.log(action.type) // "increment"
  return next(action);
});

increment(1); // { type: "increment", payload: 1 };
const dispatch = createChain(increment); // will instead use the second arg from createSculk
```
