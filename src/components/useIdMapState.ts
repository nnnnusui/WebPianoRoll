import useMapState from "./useMapState";

type Id = number;
function useIdMapState<Value>(init: [Id, Value][] = []) {
  const state = useMapState<Id, Value>(init);

  return {
    ...state,
    add: (value: Value) =>
      state.use((state) => {
        const id = Math.max(0, ...Array.from(state.keys())) + 1;
        state.set(id, value);
      }),
    getAllWithId: () => state.getAll().map(([id, value]) => ({ id, ...value })),
  };
}
export default useIdMapState;
