import { FC, useMemo } from "react";
import { GeoJSONSource } from "@maplibre/maplibre-react-native";
import { getCameraLineLayers, routeSourceIds, RouteGeometryData } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { renderLayerSpec } from "./render-layer-spec";

interface Props {
    routeGeometryData: RouteGeometryData;
}

export const DebugRouteCameraLineLayer: FC<Props> = ({ routeGeometryData }) => {
    const data = useMemo(
        () => ({
            type: 'FeatureCollection' as const,
            features: [routeGeometryData.spline],
        }),
        [routeGeometryData],
    );

    return (
        <GeoJSONSource
            id={routeSourceIds.cameraLine}
            data={data}
        >
            {getCameraLineLayers().map(renderLayerSpec)}
        </GeoJSONSource>
    );
};
