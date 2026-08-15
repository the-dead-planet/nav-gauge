import { FC, useEffect, useMemo } from "react";
import maplibregl, { LngLat } from "maplibre-gl";
import { OverlayComponentProps, useMachineWard } from "@apparatus";
import { getRouteSourceData, RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { emptyCollection, useSubjectState } from "@tinker-chest";
import { updateRouteLayer } from "../tinkers";
import { useLoadedWebImages } from "../hooks";
import { WebMarkerImageData } from "../images/image-parser";
import { RouteLineLayer } from "./RouteLineLayer";
import { RouteCurrentPointLayer } from "./RouteCurrentPointLayer";

export const RouteLayer: FC<OverlayComponentProps<maplibregl.Map> & RouteStoryProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    map,
    animatrix,
    data$,
    state$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator,
}) => {
    const [{ geojson }] = useSubjectState(data$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [progressMs] = useSubjectState(progressMs$);
    const { chronoLens } = useMachineWard();
    const [state] = useSubjectState(state$);
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const {
        pitch,
        zoom,
        cameraRoll,
        easeDuration,
        bearingLineLengthInMeters,
    } = animationControls;

    const loadedImages = useLoadedWebImages(images);

    const sources = useMemo((): { [key in 'line' | 'currentPoint']: GeoJSON.GeoJSON } => {
        if (!geojson || !routeTimes) {
            return { currentPoint: emptyCollection, line: emptyCollection }
        }
        return getRouteSourceData(
            state,
            geojson,
            routeTimes.startTimeEpoch,
            progressMs, // Not a dependency of this memo, data is updated later in the animateRoute hook
            bearingLineLengthInMeters
        );
    }, [geojson, routeTimes, bearingLineLengthInMeters, state]);

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
                    roll: pitch !== 0 ? cameraRoll : 0,
                });
            },
        );

        return () => {
            playerOperator.cleanupAnimateRoute();
        };
    }, [isPlaying, loadedImages, easeDuration, zoom, pitch, cameraRoll]);

    return (
        <>
            <RouteLineLayer map={map} source={sources.line} state={state} />
            <RouteCurrentPointLayer map={map} source={sources.currentPoint} />
        </>
    );
};
