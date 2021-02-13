import { useState } from "react";

function useMapState<Key, Value = undefined>(init: [Key, Value][] = []) {
  type State = Map<Key, Value>;
  const [state, _setState] = useState<State>(new Map(init));
  const setState = (action: (prev: State) => void) => {
    _setState((prev) => {
      action(prev);
      return new Map(prev);
    });
  };
  return {
    get: state,
    set: setState,
    update: (key: Key, value: Value) =>
      setState((prev) => prev.set(key, value)),
    remove: (key: Key) => setState((prev) => prev.delete(key)),
  };
}
export default useMapState;
