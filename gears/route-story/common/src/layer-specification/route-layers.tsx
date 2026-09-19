import { FeatureStateProps } from "@apparatus";
import { RGBColor, Theme } from "@ui";
import { EqualBooleanFeatureState, GetProperty, LineCap } from "./model";
import { RouteStoryLineStyle, RouteStoryState } from "../model";

export const defaultRouteStoryState: RouteStoryState = {
    routeStyleActive: {
        showRouteLine: true,
        showRoutePoints: false,
        pointColor: 'rgb(160, 48, 160)',
        pointRadius: 3,
        color: 'rgb(160, 48, 160)',
        width: 2,
        outlineColor: 'rgb(255, 255, 255)',
        outlineWidth: 1,
        variant: 'solid',
    },
    routeStyleInactive: {
        showRouteLine: true,
        showRoutePoints: false,
        pointColor: 'rgb(221, 160, 221)',
        pointRadius: 3,
        color: 'rgb(221, 160, 221)',
        width: 1,
        outlineColor: 'rgb(255, 255, 255)',
        outlineWidth: 0,
        variant: 'dashed',
    },
    currentPoint: {
        fillColor: 'rgb(160, 48, 160)',
        size: 1,
        icon: 'Circle',
        autoRotate: true,
        rotation: 0,
        rotationAlignment: 'map',
        colorTransitionLengthPercent: 0,
    },
};

/**
 * Default style colors are derived from the theme's tertiary token, so the "restored"
 * line follows the active theme. The pristine `defaultRouteStoryState` marker is
 * independent of the theme and used to detect untouched state.
 */
export const getDefaultRouteStoryState = (theme: Theme): RouteStoryState => {
    const toCssColor = ({ r, g, b }: RGBColor): string => `rgb(${r}, ${g}, ${b})`;
    const activeColor = toCssColor(theme.colors.tertiary[700]);
    const inactiveColor = toCssColor(theme.colors.tertiary[500]);

    return {
        routeStyleActive: {
            showRouteLine: true,
            showRoutePoints: false,
            pointColor: activeColor,
            pointRadius: 3,
            color: activeColor,
            width: 2,
            outlineColor: 'rgb(255, 255, 255)',
            outlineWidth: 1,
            variant: 'solid',
        },
        routeStyleInactive: {
            showRouteLine: true,
            showRoutePoints: false,
            pointColor: inactiveColor,
            pointRadius: 3,
            color: inactiveColor,
            width: 1,
            outlineColor: 'rgb(255, 255, 255)',
            outlineWidth: 0,
            variant: 'dashed',
        },
        currentPoint: {
            fillColor: activeColor,
            size: 1,
            icon: 'Circle',
            autoRotate: true,
            rotation: 0,
            rotationAlignment: 'map',
            colorTransitionLengthPercent: 0,
        },
    };
};

export const routeSourceIds = {
    line: 'route-story-line',
    cameraLine: 'route-story-camera-line',
    currentPoint: 'route-story-current-point',
}

/**
 * Keys follow layer order
 */
export const routeLayerIds = {
    lineActiveOutline: 'route-line-active-outline',
    lineActive: 'route-line-active',
    lineInactiveOutline: 'route-line-inactive-outline',
    lineInactive: 'route-line-inactive',
    pointsActive: 'route-points-active',
    pointsInactive: 'route-points-inactive',
    currentPoint: 'route-current-point',
}

export const routeCameraLayerIds = {
    line: 'route-line-simplified',
    points: 'route-points-simplified',
}

type RouteStatus = 'before' | 'after';
type RouteLineColorInterpolation = ['interpolate', ['linear'], ['line-progress'], number, string, number, string];
type RouteLineGradient =
    | ['step', ['line-progress'], string, number, string]
    | ['case', ['<=' | '>', ['line-progress'], number], RouteLineColorInterpolation, string];
type RouteStatusFilter = ['==', GetProperty, RouteStatus];
type HighlightOrStatusColor = [
    'case',
    EqualBooleanFeatureState, string,
    ['==', GetProperty, RouteStatus], string,
    string
];
type HighlightColor = ['case', EqualBooleanFeatureState, string, string];

export interface RouteLineLayerSpec {
    id: string;
    type: 'line';
    source: string;
    filter?: RouteStatusFilter;
    layout: {
        'line-cap': LineCap;
        'line-join': LineCap;
        visibility: 'visible' | 'none';
    };
    paint: {
        'line-color'?: string;
        'line-gradient'?: RouteLineGradient;
        'line-width': number;
        'line-opacity': number;
        'line-dasharray'?: number[];
    };
}

export interface RouteCircleLayerSpec {
    id: string;
    type: 'circle';
    source: string;
    filter?: RouteStatusFilter | ['<=', GetProperty, number] | ['>', GetProperty, number];
    layout: {
        visibility: 'visible' | 'none';
    };
    paint: {
        'circle-color': string | HighlightOrStatusColor | HighlightColor;
        'circle-radius': number;
    };
}

export interface RouteSymbolLayerSpec {
    id: string;
    type: 'symbol';
    source: string;
    layout: {
        'icon-image': string;
        'icon-size': number;
        'icon-allow-overlap': true;
        'icon-ignore-placement': true;
        'icon-rotation-alignment': 'map' | 'viewport';
        'icon-rotate': number | ['+', number, ['get', 'heading']];
    };
    paint: {
        'icon-color': string;
    };
}

const statusFilter = (status: RouteStatus): RouteStatusFilter => ['==', ['get', 'status'], status];

const getLinePart = (status: RouteStatus, style: RouteStoryLineStyle, isOutline: boolean): RouteLineLayerSpec => ({
    id: routeLayerIds[
        isOutline
            ? status === 'before' ? 'lineActiveOutline' : 'lineInactiveOutline'
            : status === 'before' ? 'lineActive' : 'lineInactive'
    ],
    type: 'line',
    source: routeSourceIds.line,
    filter: statusFilter(status),
    layout: {
        'line-cap': 'round',
        'line-join': 'round',
        visibility: style.showRouteLine && (!isOutline || style.outlineWidth > 0) ? 'visible' : 'none',
    },
    paint: {
        'line-color': isOutline ? style.outlineColor : style.color,
        'line-width': isOutline ? style.width + style.outlineWidth * 2 : style.width,
        'line-opacity': 1,
        ...(style.variant === 'dashed' ? { 'line-dasharray': getLineDashArray(style, isOutline) } : {}),
    },
});

const getLineDashArray = (style: RouteStoryLineStyle, isOutline: boolean): number[] => {
    const dashWidth = isOutline ? style.width + style.outlineWidth * 2 : style.width;

    return [2 * (style.width / dashWidth), 2 * (style.width / dashWidth)];
};

export const getRouteLineLayers = (state: RouteStoryState): RouteLineLayerSpec[] => {
    return [
        getLinePart('after', state.routeStyleInactive, true),
        getLinePart('before', state.routeStyleActive, true),
        getLinePart('after', state.routeStyleInactive, false),
        getLinePart('before', state.routeStyleActive, false),
    ];
};

export const getProgressRouteLineLayers = (
    state: RouteStoryState,
    routeDistanceFraction: number,
): RouteLineLayerSpec[] => {
    return getRouteLineLayers(state).map((layer) => {
        const status: RouteStatus = layer.id === routeLayerIds.lineActive || layer.id === routeLayerIds.lineActiveOutline
            ? 'before'
            : 'after';
        const isOutline = layer.id === routeLayerIds.lineActiveOutline || layer.id === routeLayerIds.lineInactiveOutline;
        const activeColor = isOutline ? state.routeStyleActive.outlineColor : state.routeStyleActive.color;
        const inactiveColor = isOutline ? state.routeStyleInactive.outlineColor : state.routeStyleInactive.color;
        const { filter: _filter, ...layerWithoutFilter } = layer;
        const { 'line-color': _lineColor, ...paint } = layer.paint;

        return {
            ...layerWithoutFilter,
            paint: {
                ...paint,
                'line-gradient': getRouteLineGradient(
                    status,
                    activeColor,
                    inactiveColor,
                    routeDistanceFraction,
                    state.currentPoint.colorTransitionLengthPercent / 100,
                ),
            },
        };
    });
};

export const getRouteLineGradient = (
    status: RouteStatus,
    activeColor: string,
    inactiveColor: string,
    routeDistanceFraction: number,
    transitionLength: number,
): RouteLineGradient => {
    const transparent = 'rgba(0, 0, 0, 0)';
    if (transitionLength <= 0 || routeDistanceFraction <= 0) {
        return ['step', ['line-progress'], status === 'before' ? activeColor : transparent, routeDistanceFraction, status === 'before' ? transparent : inactiveColor];
    }
    const start = Math.max(0, routeDistanceFraction - transitionLength);
    const end = routeDistanceFraction;
    const colorTransition: RouteLineColorInterpolation = ['interpolate', ['linear'], ['line-progress'], start, activeColor, end, inactiveColor];

    return ['case', [status === 'before' ? '<=' : '>', ['line-progress'], routeDistanceFraction], colorTransition, transparent];
};

export const requiresSplitLineGeometry = (state: RouteStoryState): boolean =>
    state.routeStyleActive.variant === 'dashed' || state.routeStyleInactive.variant === 'dashed';

export const getRoutePointsLayers = (state: RouteStoryState): RouteCircleLayerSpec[] => [
    {
        id: routeLayerIds.pointsActive,
        type: 'circle',
        source: routeSourceIds.line,
        filter: statusFilter('before'),
        layout: { visibility: state.routeStyleActive.showRoutePoints ? 'visible' : 'none' },
        paint: {
            'circle-color': [
                'case',
                ["==", ["feature-state", FeatureStateProps.Highlight], true],
                'red',
                ['==', ['get', 'status'], 'before'],
                state.routeStyleActive.pointColor,
                state.routeStyleInactive.pointColor,
            ],
            'circle-radius': state.routeStyleActive.pointRadius,
        },
    },
    {
        id: routeLayerIds.pointsInactive,
        type: 'circle',
        source: routeSourceIds.line,
        filter: statusFilter('after'),
        layout: { visibility: state.routeStyleInactive.showRoutePoints ? 'visible' : 'none' },
        paint: {
            'circle-color': [
                'case',
                ["==", ["feature-state", FeatureStateProps.Highlight], true],
                'red',
                ['==', ['get', 'status'], 'before'],
                state.routeStyleActive.pointColor,
                state.routeStyleInactive.pointColor,
            ],
            'circle-radius': state.routeStyleInactive.pointRadius,
        },
    },
];

export const getProgressRoutePointsLayers = (
    state: RouteStoryState,
    routeDistanceFraction: number,
): RouteCircleLayerSpec[] => getRoutePointsLayers(state).map((layer) => {
    const active = layer.id === routeLayerIds.pointsActive;
    const style = active ? state.routeStyleActive : state.routeStyleInactive;

    return {
        ...layer,
        filter: [active ? '<=' : '>', ['get', 'routeDistanceFraction'], routeDistanceFraction],
        paint: {
            ...layer.paint,
            'circle-color': [
                'case',
                ['==', ['feature-state', FeatureStateProps.Highlight], true],
                'red',
                style.pointColor,
            ],
        },
    };
});

export const getCurrentPointImageName = (icon: string): string => `route-current-point-${icon}`;

export const getCurrentPointLayers = (state: RouteStoryState): RouteSymbolLayerSpec[] => [{
    id: routeLayerIds.currentPoint,
    type: 'symbol',
    source: routeSourceIds.currentPoint,
    layout: {
        'icon-image': getCurrentPointImageName(state.currentPoint.icon),
        'icon-size': state.currentPoint.size,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-rotation-alignment': state.currentPoint.rotationAlignment,
        'icon-rotate': state.currentPoint.autoRotate
            ? ['+', state.currentPoint.rotation, ['get', 'heading']]
            : state.currentPoint.rotation,
    },
    paint: {
        'icon-color': state.currentPoint.fillColor,
    },
}];

export const getCameraLineLayers = (): (RouteLineLayerSpec | RouteCircleLayerSpec)[] => {
    const cameraLineColor = 'green';

    return [
        {
            id: routeCameraLayerIds.line,
            type: 'line',
            source: routeSourceIds.cameraLine,
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
                visibility: 'visible',
            },
            paint: {
                'line-color': cameraLineColor,
                'line-width': 4,
                'line-opacity': 1,
            },
        },
        {
            id: routeCameraLayerIds.points,
            type: 'circle',
            source: routeSourceIds.cameraLine,
            layout: { visibility: 'visible' },
            paint: {
                'circle-color': cameraLineColor,
                'circle-radius': 7,
            },
        },
    ];
};
