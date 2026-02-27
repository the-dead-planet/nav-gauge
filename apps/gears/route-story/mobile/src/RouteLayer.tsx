import { FC, useEffect, useMemo } from "react";
import { CircleLayer, CircleLayerStyle, LineLayer, LineLayerStyle, ShapeSource } from "@maplibre/maplibre-react-native";
import { LoadedImageData, OverlayComponentProps, useLoadedImages, useStateWarden, useSubjectState } from "@apparatus";
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

    useEffect(() => {
        // fetch('/example.gpx')
        //     .then((file) => file.text())
        //     .then((text) => parsers.get('.gpx')?.parseTextToGeoJson(text))
        //     .then((result) => setData(result ? {
        //         ...result,
        //         boundingBox: bbox(result.geojson)
        //     } : {}));
    }, []);

    const loadedImages = useLoadedImages(images);

    const sources = useMemo((): {
        [key in string]?: GeoJSON.GeoJSON;
    } | null => {
        console.log("recompute sources")
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

        let animation: number | undefined;
        let displayImageTimeout: number | undefined;
        const { startTimeEpoch, endTimeEpoch } = routeTimes;
        const sortedImageFeatures = [...loadedImages].sort((a, b) => a.featureId - b.featureId);
        let last = 0;
        let current = progressMs;
        let nextImageIndex = sortedImageFeatures.findIndex((imageFeature): boolean => {
            const f = geojson.features.find((feature) => feature.properties.id === imageFeature.featureId);
            return !!f && new Date(f.properties.time).valueOf() >= new Date(startTimeEpoch + progressMs).valueOf();
        });

        // TODO: Move to animatrix
        const animate = (time: number) => {
            const dt = time - last;
            last = time;
            current += dt + speedMultiplier;
            current += speedMultiplier;
            if (startTimeEpoch + current >= endTimeEpoch) {
                current = 0;
                nextImageIndex = 0;
            }
            const nextImage: LoadedImageData | undefined = sortedImageFeatures[nextImageIndex];
            const { currentPoint, currentPointBearing } = getRouteSourceData({ showRouteLine, showRoutePoints }, geojson, startTimeEpoch, current, bearingLineLengthInMeters, nextImage?.featureId);

            if (animation !== undefined && nextImage && nextImage.featureId <= Number(currentPoint.id)) {
                animatrix.displayImageId$.next(nextImage.id);
                nextImageIndex = nextImageIndex + 1;
                cancelAnimationFrame(animation);
                displayImageTimeout = setTimeout(() => {
                    animatrix.displayImageId$.next(null);
                    animation = requestAnimationFrame(animate);
                }, displayImageDuration);

                return;
            }

            if (followCurrentPoint) {
                const lngLat: GeoJSON.Position = [currentPoint.geometry.coordinates[0], currentPoint.geometry.coordinates[1]];
                const nextBearing = (cameraAngle + (autoRotate ? currentPointBearing : 0));

                map.camera?.setCamera({
                    animationMode: 'easeTo',
                    centerCoordinate: lngLat,
                    animationDuration: easeDuration,
                    zoomLevel: zoom,
                    pitch,
                    heading: nextBearing,
                });
            }

            // TODO: Calculate % of geometry done based on current progressMs and update paint property line gradient instead of all data.
            setProgressMs(current);
            animation = requestAnimationFrame(animate);
        };

        animation = requestAnimationFrame(animate);

        return () => {
            clearTimeout(displayImageTimeout);
            animatrix.displayImageId$.next(null);
            if (animation !== undefined) {
                cancelAnimationFrame(animation);
            }
        };
    }, [
        isPlaying,
        followCurrentPoint,
        cameraAngle,
        cameraRoll,
        autoRotate,
        pitch,
        zoom,
        zoomInToImages,
        speedMultiplier,
        easeDuration,
        bearingLineLengthInMeters,
        maxBearingDiffPerFrame,
        displayImageDuration,
        loadedImages
    ]);

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
