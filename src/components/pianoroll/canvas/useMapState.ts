import { SetStateAction, useState } from "react";

function useMapState<Key, Value = null>(init: [Key, Value][] = []) {
  type State = Map<Key, Value>;
  const [state, setState] = useState<State>(new Map(init));
  const use = (action: (state: State) => void) => {
    setState((prev) => {
      action(prev);
      return new Map(prev);
    });
  };

  return {
    state,
    use,
    get: (key: Key) => state.get(key),
    set: (key: Key, action: SetStateAction<Value | void>) =>
      use((prev) => {
        const before = prev.get(key);
        const value = action instanceof Function ? action(before) : action;
        if (value == undefined) return;
        prev.set(key, value);
      }),
    delete: (key: Key, action?: (value: Value) => void) => {
      const value = state.get(key);
      if (action && value) action(value);
      use((prev) => prev.delete(key));
    },
  };
}
export default useMapState;
