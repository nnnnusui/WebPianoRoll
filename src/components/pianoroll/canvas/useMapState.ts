import { useState } from "react";

function useMapState<Key, Value = undefined>(init: [Key, Value][] = []) {
  type State = Map<Key, Value>;
  const [state, setState] = useState<State>(new Map(init));
  const use = (action: (prev: State) => void) => {
    setState((prev) => {
      action(prev);
      return new Map(prev);
    });
  };

  return {
    state,
    use,
    get: (key: Key) => state.get(key),
    set: (key: Key, value: Value) => use((prev) => prev.set(key, value)),
    delete: (key: Key) => use((prev) => prev.delete(key)),
  };
}
export default useMapState;
