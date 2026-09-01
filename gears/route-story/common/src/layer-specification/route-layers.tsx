import { FeatureStateProps } from "@apparatus";
import { EqualBooleanFeatureState, ComparisonProperty, GetPropertyCaseCondition, LineCap } from "./model";

export const routeSourceIds = {
    line: 'route-story-line',
    simplifiedLine: 'route-story-line-simplified',
    currentPoint: 'route-story-current-point',
}

/**
 * Keys follow layer order
 */
export const routeLayerIds = {
    lineOutline: 'route-line-outline',
    line: 'route-line',
    points: 'route-points',
    currentPointOutline: 'route-current-point-outline',
    currentPoint: 'route-current-point',
}

const colorActive = 'rgb(160, 48, 160)';
const colorInactive = 'rgb(221, 160, 221)';

const routeLineOutlineColor = 'rgb(255, 255, 255)';
const routeLineColor: GetPropertyCaseCondition = [
    'case',
    ['==', ['get', 'status'], 'before'],
    colorActive,
    colorInactive
];
const routeOpacity: GetPropertyCaseCondition = [
    'case',
    ['==', ['get', 'status'], 'before'],
    1,
    0.4
];

const routeLineCap: LineCap = 'round';

const pointsCircleColor: [
    'case',
    EqualBooleanFeatureState,
    string,
    ComparisonProperty,
    string,
    string
] = [
        'case',
        ["==", ["feature-state", FeatureStateProps.Highlight], true],
        'red',
        ['==', ['get', 'status'], 'before'],
        colorActive,
        colorInactive
    ];

export default {
    lines: {
        lineOutlineColor: routeLineOutlineColor,
        lineColor: routeLineColor,
        lineOutlineWidth: 6,
        lineWidth: 4,
        lineOpacity: routeOpacity,
        lineCap: routeLineCap,
        lineJoin: routeLineCap,
    },
    points: {
        circleColor: pointsCircleColor,
        circleRadius: 3,
    },
    currentPointOutline: {
        circleColor: 'white',
        circleRadius: 7,
    },
    currentPoint: {
        circleColor: colorActive,
        circleRadius: 5,
    }
}