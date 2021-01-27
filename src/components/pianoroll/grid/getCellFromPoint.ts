const getCellFromPoint = (clientX: number, clientY: number) => {
  const element = document.elementFromPoint(clientX, clientY);
  if (element == null) return;
  const types = ["ActionCell", "Note"] as const;
  type Type = typeof types[number];
  const type: Type | undefined = types.find(
    (it) => it == element.getAttribute("type")
  );
  const gridIndex = Number(element.getAttribute("gridindex"));
  if (isNaN(gridIndex) || type == undefined) return;
  return { type, gridIndex };
};
export default getCellFromPoint;
