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

  const set = (key: Key, action: SetStateAction<Value | void>) =>
    use((prev) => {
      const before = prev.get(key);
      const value = action instanceof Function ? action(before) : action;
      if (value == undefined) return;
      prev.set(key, value);
    });

  return {
    state,
    use,
    get: (key: Key) => state.get(key),
    set,
    delete: (key: Key) => use((prev) => prev.delete(key)),
  };
}
export default useMapState;
