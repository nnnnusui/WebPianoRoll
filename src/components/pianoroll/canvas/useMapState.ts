import { SetStateAction, useState } from "react";

function useMapState<Key, Value = undefined>(init: [Key, Value][] = []) {
  type State = Map<Key, Value>;
  const [state, setState] = useState<State>(new Map(init));
  const use = (action: (prev: State) => void) => {
    setState((prev) => {
      action(prev);
      return new Map(prev);
    });
  };

  const set = (key: Key, action: SetStateAction<Value>) =>
    use((prev) => {
      const value =
        action instanceof Function ? action(prev.get(key)!) : action;
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
