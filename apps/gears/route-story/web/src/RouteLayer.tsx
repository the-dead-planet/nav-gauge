import { FC, useEffect, useMemo } from "react";
import { LayerSpecification, SourceSpecification } from "@maplibre/maplibre-gl-style-spec";
import maplibregl from "maplibre-gl";
import bbox from "@turf/bbox";
import {
    OverlayComponentProps,
    useStateWarden,
    useSubjectState,
    useMapLayerData,
    MapLayerData,
    parsers,
} from "@apparatus";
import {
    getRouteSourceData,
    RouteToolProps,
    sourceIds,
    currentPointLayers,
    routeLineLayer,
    routePointsLayer
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { updateRouteLayer } from "./tinkers";
import { useLoadedWebImages } from "./hooks";
import { LoadedImageData } from "./images/image-parser";

export const RouteLayer: FC<OverlayComponentProps<maplibregl.Map> & RouteToolProps> = ({
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
        fetch('/example.gpx')
            .then((file) => file.text())
            .then((text) => parsers.get('.gpx')?.parseTextToGeoJson(text))
            .then((result) => setData(result ? {
                ...result,
                boundingBox: bbox(result.geojson)
            } : {}));
    }, []);

    const loadedImages = useLoadedWebImages(images);

    const sources = useMemo((): { [key in string]: SourceSpecification } => {
        if (!geojson || !routeTimes) {
            return {};
        }

        const { currentPoint, lines } = getRouteSourceData(
            { showRouteLine, showRoutePoints },
            geojson,
            routeTimes.startTimeEpoch,
            progressMs,
            bearingLineLengthInMeters
        );

        return {
            [sourceIds.line]: {
                type: 'geojson',
                data: lines,
                promoteId: 'id'
            },
            [sourceIds.currentPoint]: {
                type: 'geojson',
                data: currentPoint,
            }
        };
    }, [geojson, routeTimes?.startTimeEpoch, bearingLineLengthInMeters, showRouteLine, showRoutePoints]);

    const layers = useMemo((): LayerSpecification[] => {
        if (!geojson || !routeTimes) {
            return [];
        }
        const layers: MapLayerData['layers'] = [];

        if (showRouteLine) {
            layers.push(routeLineLayer);
        }
        if (showRoutePoints) {
            layers.push(routePointsLayer);
        }
        layers.push(...currentPointLayers);

        return layers;
    }, [geojson, routeTimes, showRouteLine, showRoutePoints]);

    const mapLayerData = useMemo(
        (): MapLayerData => ({ sources, layers }),
        [sources, layers]
    );

    useMapLayerData(map, mapLayerData)

    useEffect(() => {
        if (!isPlaying || !geojson || !routeTimes) {
            return;
        }
        let animation: number | undefined;
        let displayImageTimeout: NodeJS.Timeout | undefined;
        const { startTimeEpoch, endTimeEpoch } = routeTimes;
        const sortedImageFeatures = loadedImages.toSorted((a, b) => a.featureId - b.featureId);
        let last = performance.now();
        let current = progressMs;
        let nextImageIndex = sortedImageFeatures.findIndex((imageFeature): boolean => {
            const f = geojson.features.find((feature) => feature.properties.id === imageFeature.featureId);
            return !!f && new Date(f.properties.time).valueOf() >= new Date(startTimeEpoch + progressMs).valueOf();
        });

        // TODO: Move to animatrix
        const animate = () => {
            const now = performance.now();
            const dt = now - last;
            last = now;
            current += dt + speedMultiplier;
            if (startTimeEpoch + current >= endTimeEpoch) {
                current = 0;
                nextImageIndex = 0;
            }
            const nextImage: LoadedImageData | undefined = sortedImageFeatures[nextImageIndex];
            const { currentPoint, currentPointBearing } = updateRouteLayer({ showRouteLine, showRoutePoints }, map, geojson, startTimeEpoch, current, bearingLineLengthInMeters, nextImage?.featureId);

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
                const lngLat = new maplibregl.LngLat(currentPoint.geometry.coordinates[0], currentPoint.geometry.coordinates[1]);
                const currentBearing = map.getBearing();
                const nextBearing = (cameraAngle + (autoRotate ? currentPointBearing : 0));
                const bearingDiff = ((nextBearing - currentBearing + 540) % 360) - 180;

                map.easeTo({
                    easeId: 'follow-current-point',
                    animate: true,
                    center: lngLat,
                    essential: true,
                    duration: easeDuration,
                    zoom,
                    pitch,
                    bearing: currentBearing + Math.max(-maxBearingDiffPerFrame, Math.min(maxBearingDiffPerFrame, bearingDiff)),
                    roll: cameraRoll,
                });
            }

            // TODO: Calculate % of geometry done based on current progressMs and update paint property line gradient instead of all data.
            setProgressMs(current);
            animation = requestAnimationFrame(animate);
        };

        animate();

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
        loadedImages,
    ]);

    return null;
};
