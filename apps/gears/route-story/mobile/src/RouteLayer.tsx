import { FC, useEffect, useMemo, useRef } from "react";
import { BehaviorSubject } from "rxjs";
import { CircleLayer, CircleLayerStyle, LineLayer, LineLayerStyle, ShapeSource, ShapeSourceRef } from "@maplibre/maplibre-react-native";
import { OverlayComponentProps, useLoadedImages, useStateWarden, useSubjectState } from "@apparatus";
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

export const currentPointRef$ = new BehaviorSubject<React.RefObject<ShapeSourceRef | null> | null>(null);
export const linesRef$ = new BehaviorSubject<React.RefObject<ShapeSourceRef | null> | null>(null);

export const RouteLayer: FC<OverlayComponentProps<MobileMap> & RouteToolProps<MobileMap>> = ({
    map,
    data$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator
}) => {
    const [{ geojson }] = useSubjectState(data$);
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

    const lineSourceRef = useRef<ShapeSourceRef>(null);
    const pointSourceRef = useRef<ShapeSourceRef>(null);

    useEffect(() => {
        linesRef$.next(lineSourceRef);
        currentPointRef$.next(pointSourceRef);
        // fetch('/example.gpx')
        //     .then((file) => file.text())
        //     .then((text) => parsers.get('.gpx')?.parseTextToGeoJson(text))
        //     .then((result) => setData(result ? {
        //         ...result,
        //         boundingBox: bbox(result.geojson)
        //     } : {}));

        return () => {
            linesRef$.next(null);
            currentPointRef$.next(null);
        };
    }, []);

    const loadedImages = useLoadedImages(images);

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

    useEffect(() => {
        if (!isPlaying || !geojson || !routeTimes) {
            return;
        }
        playerOperator.animateRoute(loadedImages,
            (currentPoint, lines) => {
                lineSourceRef.current?.setNativeProps({ shape: lines });
                pointSourceRef.current?.setNativeProps({ shape: currentPoint });
            },
            (position, bearing) => {
                map.camera.current?.setCamera({
                    animationMode: 'easeTo',
                    centerCoordinate: position,
                    animationDuration: easeDuration,
                    zoomLevel: zoom,
                    pitch,
                    heading: bearing,
                });
            },
        );

        return () => {
            playerOperator.cleanupAnimateRoute();
        };
    }, [isPlaying, loadedImages, easeDuration, zoom, pitch]);

    if (!sources) {
        return null;
    }

    return (
        <>
            {(showRouteLine || showRoutePoints) && sources[sourceIds.line] ? (
                <ShapeSource
                    ref={lineSourceRef}
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
                <ShapeSource
                    ref={pointSourceRef}
                    id={sourceIds.currentPoint}
                    shape={sources[sourceIds.currentPoint]}
                >
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
