import ActionType from "./type/ActionType";

type Conditions = {
  unique: boolean;
  premise: number;
  overwrites: ActionType[];
  residue: ActionType;
};
const defaultConditions: Conditions = {
  unique: true,
  premise: 0,
  overwrites: [],
  residue: "",
};

type Override = {
  type: ActionType;
  conditions: Partial<Conditions>;
};
const dummy = {
  type: "dummy",
  conditions: { unique: false },
};
const applyDummy = (overrides: Override[]) => [
  dummy,
  ...overrides.map(({ type, conditions }) => ({
    type,
    conditions: {
      ...conditions,
      overwrites: ["dummy", ...(conditions.overwrites || [])],
    },
  })),
];

const Settings = (overrides: Override[]): Map<ActionType, Conditions> =>
  applyDummy(overrides).reduce(
    (map, { type, conditions }) =>
      map.set(type, { ...defaultConditions, ...map.get(type), ...conditions }),
    new Map<ActionType, Conditions>()
  );
const PointerActionSettings = Settings;
type PointerActionConditions = Conditions;
export default PointerActionSettings;
export type { PointerActionConditions };
