export type GetProperty = ['get', string];
export type ComparisonProperty = ['==' | '!=', GetProperty, string | number];
export type EqualBooleanFeatureState = ['==', ['feature-state', string], boolean];

export type CaseFeatureStateSingleCondition = [
    'case',
    EqualBooleanFeatureState, number | string,
    number | string
];

export type CaseFeatureStateDoubleCondition = [
    'case',
    EqualBooleanFeatureState, number | string,
    EqualBooleanFeatureState, number | string,
    number | string
];

export type GetPropertyCaseCondition = [
    'case',
    ComparisonProperty,
    string,
    string,
];

export type LineCap = "round";

export type CaseFeatureStateCondition = CaseFeatureStateSingleCondition | CaseFeatureStateDoubleCondition;
