import { range0to } from "../range";
import useIdMapState from "../useIdMapState";

type Event = React.PointerEvent;

type From = Event;
type To = Event;
type Executor = {
  tryExecute: () => void;
  execute: () => void;
  cancel: () => void;
};
type ExecutorFactory = (from: From) => (to: To) => Executor;
type Condition = (from: From) => (to: To) => boolean;
type Node = ExecutorFactory;
const DummyExecutor: ExecutorFactory = () => () => ({
  tryExecute: () => {},
  execute: () => {},
  cancel: () => {},
});
const TreeBuilder = (condition: Condition) => (
  onTrue: Node = DummyExecutor,
  onFalse: Node = DummyExecutor
) => (from: Event) => (to: Event) =>
  condition(from)(to) ? onTrue(from)(to) : onFalse(from)(to);

const Log = (name: string): ExecutorFactory => () => () => ({
  tryExecute: () => console.log(`tryExecute: ${name}`),
  execute: () => console.log(`executed: ${name}`),
  cancel: () => console.log(`canceled: ${name}`),
});
const Distance = (length: number): Condition => (from: Event) => (
  to: Event
) => {
  const distance = Math.abs(to.clientX - from.clientX);
  return length <= distance;
};
const Degree = (upper: number): Condition => (from: Event) => (to: Event) => {
  const radian = Math.atan2(
    to.clientX - from.clientX,
    to.clientY - from.clientY
  );
  const degree = 360 - (radian * (180 / Math.PI) + 180);
  return upper >= degree;
};
const RadialMenu = (factories: ExecutorFactory[]) => (from: Event) => (to: Event) => {
  const division = factories.length
  const unit = 360 / division
  const shift = unit / 2
  const conditions = factories
    .map((factory, index) => ({
      degree: Degree(unit * index + shift),
      factory
    }))
  const head = conditions[0] || {degree: Degree(360), factory: DummyExecutor}
  const target = conditions.find(({degree}) => degree(from)(to)) || head
  return target.factory(from)(to);
};
const Tree = RadialMenu([
  Log("up"),
  Log("right"),
  Log("down"),
  Log("left"),
]);

const State = () => {
  return useIdMapState<{ tree: (to: Event) => Executor }>();
};
type State = ReturnType<typeof State>;
const Distributor = (pointers: State) => {
  return {
    onPointerDown: (event: Event) => {
      const tree = Tree(event);
      const executor = tree(event);
      executor.tryExecute();
      pointers.set(event.pointerId, { tree });
    },
    onPointerMove: (event: Event) => {
      pointers.set(event.pointerId, (prev) => {
        const executor = prev.tree(event);
        executor.tryExecute();
        return prev;
      });
    },
    onPointerUp: (event: Event) => {
      pointers.delete(event.pointerId, (prev) => {
        const executor = prev.tree(event);
        executor.execute();
        return prev;
      });
    },
  };
};
const usePointerState = State;
export default Distributor;
export { usePointerState };
