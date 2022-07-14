import { createAction } from "./createAction";
import { Flow, createChain } from "./createChain";

const type = "string";
const type2 = "number";
const stringActionCreator = createAction<string>(type);
const numberActionCreator = createAction<number>(type2);

describe("createAction", () => {
  const action = stringActionCreator("hello world");

  test("created action is valid", () => {
    expect(action.type).toBe(type);
    expect(action.payload).toBe("hello world");
  });

  test("comparing actions", () => {
    expect(stringActionCreator.match(action)).toBe(true);
    expect(stringActionCreator.type === action.type);

    // @ts-ignore
    expect(stringActionCreator.match({ type: "decrement" })).toBe(false);
    // @ts-ignore
    expect(stringActionCreator.match({})).toBe(false);
  });
});

describe("createChain", () => {
  let store: string[];

  beforeEach(() => {
    store = [];
  });

  const action1 = stringActionCreator("string");
  const action2 = numberActionCreator(0);

  const flow1: Flow = (action, _, next) => next(action);
  const flow2: Flow = (action, _, next) => next(action);
  const setter: Flow = (action, _) => {
    store.push(action.payload);
  };

  test("dispatching actions", () => {
    const chainDispatch = createChain(flow1, flow2, setter);
    chainDispatch(action1);
    chainDispatch(action2);
    expect(store[0]).toBe(action1.payload);
    expect(store[1]).toBe(action2.payload);
  });

  test("dispatch function is correct", () => {
    const flow1: Flow = (action, dispatch, next) =>
      next({ type: "dispatch", payload: dispatch });
    const flow2: Flow = (action, dispatch, next) => ({
      from1: action.payload,
      from2: dispatch,
    });
    const chainDispatch = createChain(flow1, flow2);
    //@ts-ignore
    expect(
      chainDispatch === chainDispatch({ type: "", payload: "" }).from1
    ).toBe(true);
    //@ts-ignore
    expect(
      chainDispatch === chainDispatch({ type: "", payload: "" }).from2
    ).toBe(true);
  });

  test("order of flows", () => {
    let order = "";

    const flow1: Flow = (action, _, next) => {
      order += "1.";
      console.log("1");
      next(action);
    };
    const flow2: Flow = (action, _, next) => {
      order += "2.";
      console.log("2");
      next(action);
    };
    const flow3: Flow = (action, dispatch, next) => {
      order += "3.";
      console.log("3");
      if (stringActionCreator.match(action)) dispatch(action2);
      next(action);
    };

    const flow4: Flow = (action, _, next) => {
      order += "4.";
      console.log("4");
      if (numberActionCreator.match(action)) store.push("reached flow 4");
      next(action);
    };

    let chainDispatch = createChain(flow1, flow2);
    chainDispatch(action1);
    expect(order).toBe("1.2.");

    order = "";
    chainDispatch = createChain(flow1, flow2, flow3, flow4);
    chainDispatch(action1);
    expect(order).toBe("1.2.3.1.2.3.4.4.");
    expect(store).toContain("reached flow 4");
  });
});
