import Context from "../context/Context";
import { ActionSource } from "../context/Action";

const ActionListeners = () => {
  const action = Context.action.Dispatch();
  return {
    onPointerDown: (event: React.PointerEvent) =>
      action((prev) => ({
        ...prev,
        from: getCellOnPointerEvent(event) || prev.from,
        apply: false,
      })),
    onPointerMove: (event: React.PointerEvent) =>
      action((prev) => ({
        ...prev,
        to: getCellOnPointerEvent(event) || prev.to,
      })),
    onPointerUp: (event: React.PointerEvent) => {
      action((prev) => ({
        ...prev,
        to: getCellOnPointerEvent(event) || prev.to,
        apply: true,
      }));
    },
    onDragStart: (event: React.DragEvent) => {
      event.preventDefault();
      return false;
    },
  };
};
export default ActionListeners;

const getCellOnPointerEvent = (event: React.PointerEvent) =>
  getCellFromPoint(event.clientX, event.clientY);
const getCellFromPoint = (clientX: number, clientY: number) => {
  const element = document.elementFromPoint(clientX, clientY);
  const type = element?.getAttribute("type");
  const gridIndex = Number(element?.getAttribute("gridindex"));
  const noteId = Number(element?.getAttribute("noteid"));
  if (type == null) return;
  if (isNaN(gridIndex)) return;
  return { type, gridIndex, noteId } as ActionSource;
};
