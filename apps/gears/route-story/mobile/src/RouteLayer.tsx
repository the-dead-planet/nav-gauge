import { FC, useEffect, useMemo, useRef } from "react";
import { BehaviorSubject } from "rxjs";
import { CircleLayer, LineLayer, ShapeSource, ShapeSourceRef } from "@maplibre/maplibre-react-native";
import { OverlayComponentProps, useStateWarden, useSubjectState } from "@apparatus";
import {
    getRouteSourceData,
    RouteToolProps,
    routeSourceIds,
    routeLayerIds,
    RouteLayers
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { useLoadedMobileImages } from "./images/useLoadedMobileImages";
import { MobileMarkerImageData } from "./images/image-parser";

export const currentPointRef$ = new BehaviorSubject<React.RefObject<ShapeSourceRef | null> | null>(null);
export const linesRef$ = new BehaviorSubject<React.RefObject<ShapeSourceRef | null> | null>(null);

export const RouteLayer: FC<OverlayComponentProps<MobileMap> & RouteToolProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = ({
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

    const loadedImages = useLoadedMobileImages(images);

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
            [routeSourceIds.line]: lines,
            [routeSourceIds.currentPoint]: currentPoint
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
            {(showRouteLine || showRoutePoints) && sources[routeSourceIds.line] ? (
                <ShapeSource
                    ref={lineSourceRef}
                    id={routeSourceIds.line}
                    shape={sources[routeSourceIds.line]}
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
            ) : null}
            {sources[routeSourceIds.currentPoint] ? (
                <ShapeSource
                    ref={pointSourceRef}
                    id={routeSourceIds.currentPoint}
                    shape={sources[routeSourceIds.currentPoint]}
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
            ) : null}
        </>
    );
};
