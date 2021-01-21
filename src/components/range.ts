const range = (from: number, to: number): number[] =>
  [...Array(to - from)].map((_, index) => from + index);
export const range0to = (to: number): number[] => range(0, to);

export default range;
