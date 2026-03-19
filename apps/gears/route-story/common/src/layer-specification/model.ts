export type GetProperty = ['get', string];
export type EqualPropertyString = ['==', GetProperty, string];
export type EqualBooleanFeatureState = ['==', ['feature-state', string], boolean];

export type OpacitySingleCondition = [
    'case',
    EqualBooleanFeatureState, number,
    number
];

export type OpacityDoubleCondition = [
    'case',
    EqualBooleanFeatureState, number,
    EqualBooleanFeatureState, number,
    number
];

export type GetPropertyCaseCondition = [
    'case',
    EqualPropertyString,
    string,
    string,
];

export type LineCap = "round";

export type Opacity = OpacitySingleCondition | OpacityDoubleCondition;
