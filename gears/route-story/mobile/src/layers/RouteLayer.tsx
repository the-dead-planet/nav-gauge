import { FC, useEffect } from "react";
import { BehaviorSubject } from "rxjs";
import { OverlayComponentProps } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { getRouteSourceData } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-apparatus";
import { emptyCollection, useSubjectState } from "@tinker-chest";
import { unstable_batchedUpdates } from "react-native";
import { useLoadedMobileImages } from "../images/useLoadedMobileImages";
import { RouteLineLayer } from "./RouteLineLayer";
import { RouteCurrentPointLayer } from "./RouteCurrentPointLayer";
import { DebugRouteCameraLineLayer } from "./DebugRouteCameraLineLayer";
import { MobileRouteStoryProps } from "../model";

export const currentPointRef$ = new BehaviorSubject<GeoJSON.GeoJSON>(emptyCollection);
export const linesRef$ = new BehaviorSubject<GeoJSON.GeoJSON>(emptyCollection);
export const routeDistanceFractionRef$ = new BehaviorSubject(0);

export const RouteLayer: FC<OverlayComponentProps<MobileMap> & MobileRouteStoryProps> = ({
    map,
    animatrix,
    data$,
    splineData$,
    state$,
    routeTimes$,
    images$,
    routeTimelinePositionMs$,
    playerOperator
}) => {
    const [{ geojson }] = useSubjectState(data$);
    const [splineData] = useSubjectState(splineData$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [routeTimelinePositionMs] = useSubjectState(routeTimelinePositionMs$);
    const { chronoLens, individuator } = useMobileMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [state] = useSubjectState(state$);
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const {
        cameraTilt,
        cameraZoom,
        easeDuration,
        playbackPacing,
    } = animationControls;
    const [currentPointSourceData, setCurrentPointSourceData] = useSubjectState(currentPointRef$);
    const [lineSourceData, setLineSourceData] = useSubjectState(linesRef$);
    const [routeDistanceFraction, setRouteDistanceFraction] = useSubjectState(routeDistanceFractionRef$);

    useEffect(() => {
        // lineRef$.next();
        // currentPointRef$.next();

        return () => {
            setLineSourceData(emptyCollection);
            setCurrentPointSourceData(emptyCollection);
        };
    }, []);

    const loadedImages = useLoadedMobileImages(images);

    useEffect(() => {
        if (!geojson || !routeTimes || !splineData) {
            setLineSourceData(emptyCollection);
            setCurrentPointSourceData(emptyCollection);
            return;
        }

        const { line, currentPoint } = getRouteSourceData({
            geojson,
            startTimeEpoch: routeTimes.startTimeEpoch,
            routeTimelinePositionMs, // Not a dependency of this memo, data is updated later in the animateRoute hook
            splineData,
        });

        setLineSourceData(line);
        setCurrentPointSourceData(currentPoint);
    }, [geojson, routeTimes?.startTimeEpoch, splineData]);

    useEffect(() => {
        if (!isPlaying || !geojson || !routeTimes) {
            return;
        }
        playerOperator.animateRoute(loadedImages,
            (currentPoint, lines, nextRouteDistanceFraction) => {
                unstable_batchedUpdates(() => {
                    setLineSourceData(lines);
                    setRouteDistanceFraction(nextRouteDistanceFraction);
                    setCurrentPointSourceData(currentPoint);
                }, undefined);
            },
            (position, bearing) => {
                map.camera$.value?.easeTo({
                    center: [position[0], position[1]],
                    duration: easeDuration,
                    zoom: cameraZoom,
                    pitch: cameraTilt,
                    bearing,
                });
            },
        );

        return () => {
            playerOperator.cleanupAnimateRoute();
        };
    }, [isPlaying, loadedImages, easeDuration, cameraZoom, cameraTilt, playbackPacing]);

    return (
        <>
            {settings.debugMode && splineData ? <DebugRouteCameraLineLayer spline={splineData} /> : null}
            <RouteLineLayer source={lineSourceData} state={state} routeDistanceFraction={routeDistanceFraction} />
            <RouteCurrentPointLayer source={currentPointSourceData} state={state} />
        </>
    );
};
