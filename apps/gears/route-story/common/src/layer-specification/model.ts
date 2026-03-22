export type GetProperty = ['get', string];
export type ComparisonProperty = ['==' | '!=', GetProperty, string | number];
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
    ComparisonProperty,
    string,
    string,
];

export type LineCap = "round";

export type Opacity = OpacitySingleCondition | OpacityDoubleCondition;
