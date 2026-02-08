import { FC, useEffect, useMemo } from "react";
import { CircleLayer, CircleLayerStyle, LineLayer, LineLayerStyle, ShapeSource } from "@maplibre/maplibre-react-native";
import { OverlayComponentProps, useStateWarden, useSubjectState } from "@apparatus";
import {
    getRouteSourceData,
    RouteToolProps,
    sourceIds,
    layerIds,
    routeLineLayer,
    currentPointLayers,
    routePointsLayer
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";

export const RouteLayer: FC<OverlayComponentProps<MobileMap> & RouteToolProps> = ({
    map,
    data$,
    routeTimes$,
    images$,
    progressMs$,
}) => {
    const [{ geojson }, setData] = useSubjectState(data$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [progressMs, setProgressMs] = useSubjectState(progressMs$);
    const { animatrix, cartomancer, chronoLens } = useStateWarden();
    const [gaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const { showRouteLine, showRoutePoints } = gaugeControls;
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const {
        followCurrentPoint,
        cameraAngle,
        autoRotate,
        pitch,
        zoom,
        zoomInToImages,
        displayImageDuration,
        cameraRoll,
        speedMultiplier,
        easeDuration,
        bearingLineLengthInMeters,
        maxBearingDiffPerFrame,
    } = animationControls;

    useEffect(() => {
        // fetch('/example.gpx')
        //     .then((file) => file.text())
        //     .then((text) => parsers.get('.gpx')?.parseTextToGeoJson(text))
        //     .then((result) => setData(result ? {
        //         ...result,
        //         boundingBox: bbox(result.geojson)
        //     } : {}));
    }, []);

    const sources = useMemo((): {
        [key in string]?: GeoJSON.GeoJSON;
    } | null => {
        if (!geojson || !routeTimes) {
            return null;
        }

        const { currentPoint, lines } = getRouteSourceData(
            { showRouteLine, showRoutePoints },
            geojson,
            routeTimes.startTimeEpoch,
            progressMs,
            bearingLineLengthInMeters
        );

        return {
            [sourceIds.line]: lines,
            [sourceIds.currentPoint]: currentPoint
        };
    }, [geojson, routeTimes?.startTimeEpoch, bearingLineLengthInMeters, showRouteLine, showRoutePoints]);

    if (!sources) {
        return null;
    }

    return (
        <>
            {(showRouteLine || showRoutePoints) && sources[sourceIds.line] ? (
                <ShapeSource
                    id={sourceIds.line}
                    shape={sources[sourceIds.line]}
                >
                    {showRouteLine ? (
                        <LineLayer
                            id={layerIds.line}
                            style={{
                                lineColor: routeLineLayer.paint?.["line-color"]!,
                                lineWidth: routeLineLayer.paint?.["line-width"]!,
                                lineOpacity: routeLineLayer.paint?.["line-opacity"]!,
                                lineCap: routeLineLayer.layout?.["line-cap"]!,
                                lineJoin: routeLineLayer.layout?.["line-join"]
                            } as LineLayerStyle}
                        />
                    ) : null}
                    {showRoutePoints ? (
                        <CircleLayer
                            id={layerIds.points}
                            style={{
                                circleRadius: routePointsLayer.paint?.["circle-radius"],
                                circleColor: routePointsLayer.paint?.["circle-color"],
                            } as CircleLayerStyle}
                        />
                    ) : null}
                </ShapeSource>
            ) : null}
            {sources[sourceIds.currentPoint] ? (
                <ShapeSource id={sourceIds.currentPoint} shape={sources[sourceIds.currentPoint]}>
                    {currentPointLayers.map((layer) => (
                        <CircleLayer
                            key={layer.id}
                            id={layerIds.currentPointOutline}
                            style={{
                                circleColor: layer.paint?.["circle-color"],
                                circleRadius: layer.paint?.["circle-radius"],
                            } as CircleLayerStyle}
                        />
                    ))}
                </ShapeSource>
            ) : null}
        </>
    );
};
