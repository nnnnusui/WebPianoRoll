import ActionType from "./type/ActionType";

type Parameter = {
  unique: boolean;
  premise: number;
  overwrites: ActionType[];
  residue: ActionType;
};
const defaultParameter: Parameter = {
  unique: true,
  premise: 0,
  overwrites: [],
  residue: "",
};

type Override = {
  type: ActionType;
  parameter: Partial<Parameter>;
};
const dummy = {
  type: "dummy",
  parameter: { unique: false },
};
const applyDummy = (overrides: Override[]) => [
  dummy,
  ...overrides.map(({ type, parameter }) => ({
    type,
    parameter: {
      ...parameter,
      overwrites: ["dummy", ...(parameter.overwrites || [])],
    },
  })),
];

const Settings = (overrides: Override[]): Map<ActionType, Parameter> =>
  applyDummy(overrides).reduce(
    (map, { type, parameter }) =>
      map.set(type, { ...(map.get(type) || defaultParameter), ...parameter }),
    new Map()
  );
const PointerActionSettings = Settings;
export default PointerActionSettings;
