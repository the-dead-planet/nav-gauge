import { FC } from "react";
import { Layer, GeoJSONSource } from "@maplibre/maplibre-react-native";
import { routeSourceIds, routeLayerIds, RouteLayers, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";

interface Props {
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
}

export const RouteLineLayer: FC<Props> = ({ source, state: { showRouteLine, showRoutePoints } }) => {

    return (
        <GeoJSONSource
            id={routeSourceIds.line}
            data={source}
        >
            {showRouteLine ? (
                <Layer
                    type="line"
                    id={routeLayerIds.line}
                    layout={{
                        "line-cap": RouteLayers.lines.lineCap,
                        "line-join": RouteLayers.lines.lineJoin,
                    }}
                    paint={{
                        "line-color": RouteLayers.lines.lineColor,
                        "line-width": RouteLayers.lines.lineWidth,
                        "line-opacity": RouteLayers.lines.lineOpacity,
                    }}
                />
            ) : null}
            {showRoutePoints ? (
                <Layer
                    type="circle"
                    id={routeLayerIds.points}
                    paint={{
                        "circle-radius": RouteLayers.points.circleRadius,
                        "circle-color": RouteLayers.points.circleColor,
                    }}
                />
            ) : null}
        </GeoJSONSource>
    );
};
