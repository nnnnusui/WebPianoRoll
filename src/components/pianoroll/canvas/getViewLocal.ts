const getViewLocal = (event: React.MouseEvent) => {
  const element = event.target as HTMLElement;
  const rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};
export default getViewLocal;
