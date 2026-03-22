import { FeatureStateProps } from "@apparatus";
import { EqualBooleanFeatureState, EqualPropertyString, GetPropertyCaseCondition, LineCap } from "./model";

export const routeSourceIds = {
    line: 'route-story-line',
    currentPoint: 'route-story-current-point',
}

/**
 * Keys follow layer order
 */
export const routeLayerIds = {
    line: 'route-line',
    points: 'route-points',
    currentPointOutline: 'route-current-point-outline',
    currentPoint: 'route-current-point',
}

const colorActive = '#003161';
const colorInactive = 'grey';

const routeLineColor: GetPropertyCaseCondition = [
    'case',
    ['==', ['get', 'status'], 'before'],
    colorActive,
    colorInactive
];

const routeLineCap: LineCap = 'round';

const pointsCircleColor: [
    'case',
    EqualBooleanFeatureState,
    string,
    EqualPropertyString,
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
        lineColor: routeLineColor,
        lineWidth: 2,
        lineOpacity: .6,
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