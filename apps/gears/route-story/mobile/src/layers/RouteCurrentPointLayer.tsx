import { FC } from "react";
import { CircleLayer, ShapeSource, ShapeSourceRef } from "@maplibre/maplibre-react-native";
import { routeSourceIds, routeLayerIds, RouteLayers } from "@the-dead-planet/nav-gauge-gears-route-story-common";

interface Props {
    sourceRef: React.RefObject<ShapeSourceRef | null>;
    source: GeoJSON.GeoJSON
}

export const RouteCurrentPointLayer: FC<Props> = ({
    sourceRef,
    source
}) => {
    return (
        <ShapeSource
            ref={sourceRef}
            id={routeSourceIds.currentPoint}
            shape={source}
        >
            <CircleLayer
                id={routeLayerIds.currentPointOutline}
                style={{
                    circleColor: RouteLayers.currentPointOutline.circleColor,
                    circleRadius: RouteLayers.currentPointOutline.circleRadius,
                }}
            />
            <CircleLayer
                id={routeLayerIds.currentPoint}
                style={{
                    circleColor: RouteLayers.currentPoint.circleColor,
                    circleRadius: RouteLayers.currentPoint.circleRadius,
                }}
            />
        </ShapeSource>
    );
};
