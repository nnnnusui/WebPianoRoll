type Diff<T, U> = Omit<T, keyof U & keyof T>;
export default Diff
