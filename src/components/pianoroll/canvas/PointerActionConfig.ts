type PointerActionType = string;
type PointerActionConfigParameter = {
  unique: boolean;
  premise: number;
  overwrites: PointerActionType[];
  residue: PointerActionType;
};
type PointerActionConfigValue = {
  type: PointerActionType;
  parameter: PointerActionConfigParameter;
};
type PointerActionConfigOverride = {
  type: PointerActionType;
  parameter: Partial<PointerActionConfigParameter>;
};
type PointerActionConfig = Map<PointerActionType, PointerActionConfigParameter>;
const dummyAction: PointerActionConfigValue = {
  type: "dummy",
  parameter: { unique: false, overwrites: [], premise: 0, residue: "" },
};
const parameterOverride = (to: Partial<PointerActionConfigParameter>) => ({
  ...to,
  overwrites: ["dummy", ...(to.overwrites || [])],
});
const applyDummy = (overrides: PointerActionConfigOverride[]) => {
  return overrides.map((it) => ({
    ...it,
    parameter: parameterOverride(it.parameter),
  }));
};

const defaultParameter: PointerActionConfigParameter = {
  unique: true,
  premise: 0,
  overwrites: [],
  residue: "",
};

const PointerActionConfig = (overrides: PointerActionConfigOverride[]) =>
  applyDummy(overrides).reduce(
    (map, it) => map.set(it.type, { ...defaultParameter, ...it.parameter }),
    new Map([[dummyAction.type, dummyAction.parameter]])
  );

export default PointerActionConfig;
export type {
  PointerActionType,
  PointerActionConfigParameter,
  PointerActionConfigOverride,
};
