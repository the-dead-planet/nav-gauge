export type GetProperty = ['get', string];
export type ComparisonProperty = ['==' | '!=', GetProperty, string | number | boolean];
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

export type CaseFeatureStateOrPropertySingleCondition = [
    'case',
    ['any', EqualBooleanFeatureState, ComparisonProperty], number | string,
    number | string
];

export type CaseFeatureStateOrPropertyDoubleCondition = [
    'case',
    ['any', EqualBooleanFeatureState, ComparisonProperty], number | string,
    ['any', EqualBooleanFeatureState, ComparisonProperty], number | string,
    number | string
];

export type GetPropertyCaseCondition = [
    'case',
    ComparisonProperty,
    string | number,
    string | number,
];

export type LineCap = "round";

export type CaseFeatureStateCondition = CaseFeatureStateSingleCondition | CaseFeatureStateDoubleCondition;
export type CaseFeatureStateOrPropertyCondition = CaseFeatureStateOrPropertySingleCondition | CaseFeatureStateOrPropertyDoubleCondition;
