import { FC } from "react";
import { CircleLayer, LineLayer, ShapeSource, ShapeSourceRef } from "@maplibre/maplibre-react-native";
import { useStateWarden, useSubjectState } from "@apparatus";
import { routeSourceIds, routeLayerIds, RouteLayers } from "@the-dead-planet/nav-gauge-gears-route-story-common";

interface Props {
    sourceRef: React.RefObject<ShapeSourceRef | null>;
    source: GeoJSON.GeoJSON
}

export const RouteLineLayer: FC<Props> = ({
    sourceRef,
    source,
}) => {
    const { cartomancer } = useStateWarden();
    const [gaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const { showRouteLine, showRoutePoints } = gaugeControls;

    return (
        <ShapeSource
            ref={sourceRef}
            id={routeSourceIds.line}
            shape={source}
        >
            {showRouteLine ? (
                <LineLayer
                    id={routeLayerIds.line}
                    style={{
                        lineColor: RouteLayers.lines.lineColor,
                        lineWidth: RouteLayers.lines.lineWidth,
                        lineOpacity: RouteLayers.lines.lineOpacity,
                        lineCap: RouteLayers.lines.lineCap,
                        lineJoin: RouteLayers.lines.lineJoin,
                    }}
                />
            ) : null}
            {showRoutePoints ? (
                <CircleLayer
                    id={routeLayerIds.points}
                    style={{
                        circleRadius: RouteLayers.points.circleRadius,
                        circleColor: RouteLayers.points.circleColor,
                    }}
                />
            ) : null}
        </ShapeSource>
    );
};
