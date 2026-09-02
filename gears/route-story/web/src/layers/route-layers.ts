import { CircleLayerSpecification, LayerSpecification, LineLayerSpecification } from "maplibre-gl";
import { routeLayerIds, RouteLayers, routeSourceIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const routeLineLayers: LineLayerSpecification[] = [
    {
        id: routeLayerIds.lineOutline,
        source: routeSourceIds.line,
        type: 'line',
        paint: {
            'line-color': RouteLayers.lines.lineOutlineColor,
            'line-width': RouteLayers.lines.lineOutlineWidth,
            'line-opacity': RouteLayers.lines.lineOpacity,
        },
        layout: {
            'line-cap': RouteLayers.lines.lineCap,
            'line-join': RouteLayers.lines.lineJoin
        }
    },
    {
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
    },
];

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

export const cameraLineLayers: LayerSpecification[] = [
    {
        id: routeLayerIds.line + 'simplified',
        source: routeSourceIds.cameraLine,
        type: 'line',
        layout: {},
        paint: {
            'line-width': RouteLayers.cameraLine.lineWidth,
            'line-color': RouteLayers.cameraLine.lineColor,
        }
    },
    {
        id: routeLayerIds.points + 'simplified',
        source: routeSourceIds.cameraLine,
        type: 'circle',
        layout: {},
        paint: {
            'circle-radius': RouteLayers.cameraLine.pipeCircleRadius,
            'circle-color': RouteLayers.cameraLine.pipeCircleColor,
        }
    }
];
