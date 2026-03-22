import { FC, useEffect, useMemo } from "react";
import maplibregl, { LngLat } from "maplibre-gl";
import bbox from "@turf/bbox";
import { OverlayComponentProps, useStateWarden, useSubjectState, parsers } from "@apparatus";
import { getRouteSourceData, RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { updateRouteLayer } from "../tinkers";
import { useLoadedWebImages } from "../hooks";
import { WebMarkerImageData } from "../images/image-parser";
import { emptyCollection } from "@tinker-chest";
import { RouteLineLayer } from "./RouteLineLayer";
import { RouteCurrentPointLayer } from "./RouteCurrentPointLayer";

export const RouteLayer: FC<OverlayComponentProps<maplibregl.Map> & RouteToolProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    map,
    data$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator,
}) => {
    const [{ geojson }, setData] = useSubjectState(data$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [progressMs] = useSubjectState(progressMs$);
    const { animatrix, cartomancer, chronoLens } = useStateWarden();
    const [gaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const { showRouteLine, showRoutePoints } = gaugeControls;
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const {
        pitch,
        zoom,
        cameraRoll,
        easeDuration,
        bearingLineLengthInMeters,
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

    const sources = useMemo((): { [key in 'line' | 'currentPoint']: GeoJSON.GeoJSON } => {
        if (!geojson || !routeTimes) {
            return { currentPoint: emptyCollection, line: emptyCollection }
        }
        return getRouteSourceData(
            { showRouteLine, showRoutePoints },
            geojson,
            routeTimes.startTimeEpoch,
            progressMs, // Not a dependency of this memo, data is updated later in the animateRoute hook
            bearingLineLengthInMeters
        );
    }, [geojson, routeTimes, bearingLineLengthInMeters, showRouteLine, showRoutePoints]);

    useEffect(() => {
        if (!isPlaying || !geojson || !routeTimes) {
            return;
        }
        playerOperator.animateRoute(loadedImages,
            (currentPoint, lines) => {
                updateRouteLayer(map, lines, currentPoint);
            },
            (position, bearing) => {
                map.easeTo({
                    easeId: 'follow-current-point',
                    animate: true,
                    center: new LngLat(position[0], position[1]),
                    essential: true,
                    duration: easeDuration,
                    zoom,
                    pitch,
                    bearing,
                    roll: cameraRoll,
                });
            },
        );

        return () => {
            playerOperator.cleanupAnimateRoute();
        };
    }, [isPlaying, loadedImages, easeDuration, zoom, pitch, cameraRoll]);

    return (
        <>
            <RouteLineLayer map={map} source={sources.line} />
            <RouteCurrentPointLayer map={map} source={sources.currentPoint} />
        </>
    );
};
