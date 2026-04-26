import { FC } from "react";
import { Layer, GeoJSONSource, GeoJSONSourceRef } from "@maplibre/maplibre-react-native";
import { routeSourceIds, routeLayerIds, RouteLayers } from "@the-dead-planet/nav-gauge-gears-route-story-common";

interface Props {
    source: GeoJSON.GeoJSON
}

export const RouteCurrentPointLayer: FC<Props> = ({ source }) => {
    return (
        <GeoJSONSource
            id={routeSourceIds.currentPoint}
            data={source}
        >
            <Layer
                type="circle"
                id={routeLayerIds.currentPointOutline}
                paint={{
                    "circle-color": RouteLayers.currentPointOutline.circleColor,
                    "circle-radius": RouteLayers.currentPointOutline.circleRadius,
                }}
            />
            <Layer
                type="circle"
                id={routeLayerIds.currentPoint}
                paint={{
                    "circle-color": RouteLayers.currentPoint.circleColor,
                    "circle-radius": RouteLayers.currentPoint.circleRadius,
                }}
            />
        </GeoJSONSource>
    );
};
