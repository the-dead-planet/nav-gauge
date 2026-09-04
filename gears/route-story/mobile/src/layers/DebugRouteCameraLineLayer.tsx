import { FC, useMemo } from "react";
import { Layer, GeoJSONSource } from "@maplibre/maplibre-react-native";
import { routeSourceIds, routeLayerIds, RouteLayers, SplineData } from "@the-dead-planet/nav-gauge-gears-route-story-common";

interface Props {
    spline: SplineData;
}

export const DebugRouteCameraLineLayer: FC<Props> = ({ spline }) => {
    const data = useMemo(
        () => ({
            type: 'FeatureCollection' as const,
            features: [spline.spline],
        }),
        [spline],
    );

    return (
        <GeoJSONSource
            id={routeSourceIds.cameraLine}
            data={data}
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
