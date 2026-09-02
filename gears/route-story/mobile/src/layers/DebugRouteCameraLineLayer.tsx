import { FC, useMemo } from "react";
import { Layer, GeoJSONSource } from "@maplibre/maplibre-react-native";
import { getSplineData, routeSourceIds, routeLayerIds, RouteLayers } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { GeoJson } from "@tinker-chest";

interface Props {
    geojson: GeoJson;
}

export const DebugRouteCameraLineLayer: FC<Props> = ({ geojson }) => {
    const spline = useMemo(() => getSplineData(geojson).spline, [geojson]);

    return (
        <GeoJSONSource
            id={routeSourceIds.cameraLine}
            data={{
                ...geojson,
                features: [spline],
            }}
        >
            <Layer
                type="line"
                id={routeLayerIds.line + 'simplified'}
                paint={{
                    "line-width": RouteLayers.cameraLine.lineWidth,
                    "line-color": RouteLayers.cameraLine.lineColor,
                }}
            />
            <Layer
                type="circle"
                id={routeLayerIds.points + 'simplified'}
                paint={{
                    "circle-radius": RouteLayers.cameraLine.pipeCircleRadius,
                    "circle-color": RouteLayers.cameraLine.pipeCircleColor,
                }}
            />
        </GeoJSONSource>
    );
};
