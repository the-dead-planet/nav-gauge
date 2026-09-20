import { FC, useEffect, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import { OverlayComponentProps } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { getRouteSourceData } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { emptyCollection, useSubjectState } from "@tinker-chest";
import { updateRouteLayer } from "../tinkers";
import { useLoadedWebImages } from "../hooks";
import { RouteLineLayer } from "./RouteLineLayer";
import { RouteCurrentPointLayer } from "./RouteCurrentPointLayer";
import { WebRouteStoryProps } from "../model";
import { DebugRouteCameraLineLayer } from "./DebugRouteCameraLineLayer";

export const RouteLayer: FC<OverlayComponentProps<maplibregl.Map> & WebRouteStoryProps> = ({
    map,
    animatrix,
    data$,
    splineData$,
    state$,
    routeTimes$,
    images$,
    routeTimelinePositionMs$,
    playerOperator,
}) => {
    const [{ geojson }] = useSubjectState(data$);
    const [splineData] = useSubjectState(splineData$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [routeTimelinePositionMs] = useSubjectState(routeTimelinePositionMs$);
    const { chronoLens, individuator } = useWebMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [state] = useSubjectState(state$);
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const { cameraTilt, cameraZoom, cameraRoll, easeDuration, playbackPacing } = animationControls;

    const loadedImages = useLoadedWebImages(images);
    const source = useMemo(() => {
        if (!geojson || !routeTimes || !splineData) {
            return emptyCollection;
        }

        return getRouteSourceData({
            geojson,
            includeRoutePoints: state.routeStyleActive.showRoutePoints || state.routeStyleInactive.showRoutePoints,
            startTimeEpoch: routeTimes.startTimeEpoch,
            routeTimelinePositionMs, // Not a dependency of this memo, data is updated later in the animateRoute hook
            splineData,
        }).line;
    }, [geojson, routeTimes, splineData, state.routeStyleActive.showRoutePoints, state.routeStyleInactive.showRoutePoints]);

    useEffect(() => {
        if (!isPlaying || !geojson || !routeTimes) {
            return;
        }
        playerOperator.animateRoute(loadedImages,
            (_currentPoint, line, routeDistanceFraction) => {
                updateRouteLayer({ map, line, routeDistanceFraction, state: state$.value });
            },
            (position, bearing) => {
                map.easeTo({
                    easeId: 'follow-current-point',
                    animate: true,
                    center: new maplibregl.LngLat(position[0], position[1]),
                    essential: true,
                    duration: easeDuration,
                    zoom: cameraZoom,
                    pitch: cameraTilt,
                    bearing,
                    roll: cameraRoll,
                });
            },
        );

        return () => {
            playerOperator.cleanupAnimateRoute();
        };
    }, [isPlaying, loadedImages, easeDuration, cameraZoom, cameraTilt, cameraRoll, playbackPacing]);

    return (
        <>
            {settings.debugMode && splineData ? (
                <DebugRouteCameraLineLayer map={map} spline={splineData} />
            ) : null}
            <RouteLineLayer map={map} source={source} state={state} />
            <RouteCurrentPointLayer map={map} state={state} />
        </>
    );
};
