const GetCell = () => {
  return {
    onMouseEvent: getCellOnMouseEvent,
    onTouchEvent: getCellOnTouchEvent,
  };
};
export default GetCell;

const getCellOnMouseEvent = (event: React.MouseEvent) =>
  getCellFromPoint(event.clientX, event.clientY);
const getCellOnTouchEvent = (event: React.TouchEvent) =>
  Array.from(event.changedTouches).map((it) =>
    getCellFromPoint(it.clientX, it.clientY)
  );
const getCellFromPoint = (clientX: number, clientY: number) => {
  const element = document.elementFromPoint(clientX, clientY);
  const gridIndex = Number(element?.getAttribute("gridindex"));
  return { gridIndex };
};
