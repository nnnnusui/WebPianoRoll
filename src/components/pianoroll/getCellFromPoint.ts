const getCellFromPoint = (clientX: number, clientY: number) => {
  const element = document.elementFromPoint(clientX, clientY);
  if (element == null) return;
  const types = ["ActionCell", "Note"] as const;
  type Type = typeof types[number];
  const type: Type | undefined = types.find(
    (it) => it == element.getAttribute("type")
  );
  const index = Number(element.getAttribute("index"));
  if (isNaN(index) || type == undefined) return;
  return { type, index };
};
export default getCellFromPoint;
