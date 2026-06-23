import { CircleLayerSpecification, LineLayerSpecification } from "maplibre-gl";
import { routeLayerIds, RouteLayers, routeSourceIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const routeLineLayer: LineLayerSpecification = {
    id: routeLayerIds.line,
    source: routeSourceIds.line,
    type: 'line',
    paint: {
        'line-color': RouteLayers.lines.lineColor,
        'line-width': RouteLayers.lines.lineWidth,
        'line-opacity': RouteLayers.lines.lineOpacity,
    },
    layout: {
        'line-cap': RouteLayers.lines.lineCap,
        'line-join': RouteLayers.lines.lineJoin
    }
};

export const routePointsLayer: CircleLayerSpecification = {
    id: routeLayerIds.points,
    source: routeSourceIds.line,
    type: 'circle',
    paint: {
        'circle-color': RouteLayers.points.circleColor,
        'circle-radius': RouteLayers.points.circleRadius,
    }
};

export const currentPointLayers: CircleLayerSpecification[] = [
    {
        id: routeLayerIds.currentPointOutline,
        source: routeSourceIds.currentPoint,
        type: 'circle',
        paint: {
            'circle-color': RouteLayers.currentPointOutline.circleColor,
            'circle-radius': RouteLayers.currentPointOutline.circleRadius,
        }
    },
    {
        id: routeLayerIds.currentPoint,
        source: routeSourceIds.currentPoint,
        type: 'circle',
        paint: {
            'circle-color': RouteLayers.currentPoint.circleColor,
            'circle-radius': RouteLayers.currentPoint.circleRadius,
        }
    }
];
