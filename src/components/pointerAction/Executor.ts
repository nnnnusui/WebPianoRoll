type Executor = {
  down: (events: Event[]) => void;
  move: (events: Event[]) => void;
  up: (events: Event[]) => void;
  cancel: (events: Event[]) => void;
  draw: (context: CanvasRenderingContext2D) => void;
};
export default Executor;
