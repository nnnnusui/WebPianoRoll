import { useState } from "react";

function useMapState<Key, Value>(init: [Key, Value][] = []) {
  type State = Map<Key, Value>;
  const [state, setState] = useState<State>(new Map(init));
  const use = (action: (state: State) => void) => {
    setState((prev) => {
      action(prev);
      return new Map(prev);
    });
  };

  return {
    ...state,
    use,
    clear: () => use((prev) => prev.clear()),
    delete: (key: Key, action?: (value: Value) => void) =>
      use((state) => {
        const value = state.get(key);
        if (action && value) action(value);
        state.delete(key);
      }),
    set: (key: Key, action: Value | ((value: Value | undefined) => Value)) =>
      use((state) => {
        const before = state.get(key);
        const value = action instanceof Function ? action(before) : action;
        state.set(key, value);
      }),
    get: (key: Key) => state.get(key),
    getAll: () => Array.from(state),
    values: () => state.values(),
    forEach: (callbackfn: Parameters<typeof state.forEach>[0]) =>
      state.forEach(callbackfn),
  };
}
export default useMapState;
