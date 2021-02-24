import useIdMapState from "../useIdMapState";

type Event = React.PointerEvent;
type Info = {
  executor: Executor;
  factory: ExecutorFactory
};
const State = () => {
  return useIdMapState<Info>();
};
type State = ReturnType<typeof State>;
type ConditionTree = (event: Event) => ExecutorFactory
type ExecutorFactory = (event: Event) => Executor;
type Executor = {
  tryExecute: (event: Event) => void;
  execute: (event: Event) => void;
  cancel: (event: Event) => void;
};
const DummyExecutor: ExecutorFactory = () => ({
  tryExecute: () => {},
  execute: () => {},
  cancel: () => {},
});
const Log: ExecutorFactory = () => ({
  tryExecute: () => {
    console.log("tryExecute");
  },
  execute: () => {
    console.log("executed");
  },
  cancel: () => {
    console.log("canceled");
  },
});

const Distance = (length: number) => {
  return (onTrue = DummyExecutor, onFalse = DummyExecutor) => (from: Event) => {
    const check = (to: Event) => {
      const distance = Math.abs(to.clientX - from.clientX);
      console.log(distance);
      return length <= distance;
    };
    return (event: Event) => (check(event) ? onTrue(from) : onFalse(from));
  };
};
const Degree = (upper: number) => {
  return (onTrue = DummyExecutor, onFalse = DummyExecutor) => (from: Event) => {
    const check = (to: Event) => {
      const radian = Math.atan2(to.clientX - from.clientX, to.clientY - from.clientY);
      const degree = 360 - (radian * (180 / Math.PI) + 180)
      console.log(degree);
      return upper >= degree;
    };
    return (event: Event) => (check(event) ? onTrue(from) : onFalse(from));
  };
}
const Tree: ConditionTree = Degree(100)(Log);

const Distributor = (pointers: State) => {
  return {
    onPointerDown: (event: Event) => {
      const factory = Tree(event);
      const executor = factory(event);
      executor.tryExecute(event);
      pointers.set(event.pointerId, {executor, factory});
    },
    onPointerMove: (event: Event) => {
      pointers.set(event.pointerId, (prev) => {
        const executor = prev.factory(event)
        executor.tryExecute(event);
        return prev;
      });
    },
    onPointerUp: (event: Event) => {
      pointers.delete(event.pointerId, (prev) => {
        const executor = prev.factory(event)
        executor.execute(event);
        return prev;
      });
    },
  };
};
const usePointerState = State;
export default Distributor;
export { usePointerState };
