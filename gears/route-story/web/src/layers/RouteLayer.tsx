import { FC, useEffect, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import { OverlayComponentProps } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { getRouteSourceData, getStaticRouteSourceData, requiresSplitLineGeometry } from "@the-dead-planet/nav-gauge-gears-route-story-common";
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
    const createSplitLineGeometry = requiresSplitLineGeometry(state);

    const sources = useMemo(() => {
        if (!geojson || !routeTimes || !splineData) {
            return { currentPoint: emptyCollection, line: emptyCollection, routeDistanceFraction: 0 };
        }

        const frame = getRouteSourceData({
            geojson,
            startTimeEpoch: routeTimes.startTimeEpoch,
            routeTimelinePositionMs, // Not a dependency of this memo, data is updated later in the animateRoute hook
            splineData,
            createSplitLineGeometry,
        });
        return { ...frame, line: createSplitLineGeometry ? frame.line : getStaticRouteSourceData(geojson, splineData) };
    }, [geojson, routeTimes, splineData, createSplitLineGeometry]);

    useEffect(() => {
        if (!isPlaying || !geojson || !routeTimes) {
            return;
        }
        playerOperator.animateRoute(loadedImages,
            (currentPoint, line, routeDistanceFraction) => {
                updateRouteLayer({ map, currentPoint, line, routeDistanceFraction, createSplitLineGeometry, state: state$.value });
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
            { createSplitLineGeometry },
        );

        return () => {
            playerOperator.cleanupAnimateRoute();
        };
    }, [isPlaying, loadedImages, easeDuration, cameraZoom, cameraTilt, cameraRoll, playbackPacing, createSplitLineGeometry]);

    return (
        <>
            {settings.debugMode && splineData ? (
                <DebugRouteCameraLineLayer map={map} spline={splineData} />
            ) : null}
            <RouteLineLayer key={createSplitLineGeometry ? 'split' : 'static'} map={map} source={sources.line} state={state} routeDistanceFraction={createSplitLineGeometry ? undefined : sources.routeDistanceFraction} createSplitLineGeometry={createSplitLineGeometry} />
            <RouteCurrentPointLayer map={map} source={sources.currentPoint} state={state} />
        </>
    );
};
