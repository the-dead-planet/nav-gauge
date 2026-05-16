import { FC, useEffect } from "react";
import { BehaviorSubject } from "rxjs";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { OverlayComponentProps, useMachineWard } from "@apparatus";
import { getRouteSourceData, RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";
import { emptyCollection, useSubjectState } from "@tinker-chest";
import { MobileMarkerImageData } from "../images/image-parser";
import { useLoadedMobileImages } from "../images/useLoadedMobileImages";
import { RouteLineLayer } from "./RouteLineLayer";
import { RouteCurrentPointLayer } from "./RouteCurrentPointLayer";

export const currentPointRef$ = new BehaviorSubject<GeoJSON.GeoJSON>(emptyCollection);
export const linesRef$ = new BehaviorSubject<GeoJSON.GeoJSON>(emptyCollection);

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
    const [progressMs] = useSubjectState(progressMs$);
    const { animatrix, cartomancer, chronoLens } = useMachineWard();
    const [gaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const { showRouteLine, showRoutePoints } = gaugeControls;
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const {
        pitch,
        zoom,
        easeDuration,
        bearingLineLengthInMeters,
    } = animationControls;
    const [currentPointSourceData, setCurrentPointSourceData] = useSubjectState(currentPointRef$);
    const [lineSourceData, setLineSourceData] = useSubjectState(linesRef$);

    useEffect(() => {
        // lineRef$.next();
        // currentPointRef$.next();
        // fetch('/example.gpx')
        //     .then((file) => file.text())
        //     .then((text) => parsers.get('.gpx')?.parseTextToGeoJson(text))
        //     .then((result) => setData(result ? {
        //         ...result,
        //         boundingBox: bbox(result.geojson)
        //     } : {}));

        return () => {
            setLineSourceData(emptyCollection);
            setCurrentPointSourceData(emptyCollection);
        };
    }, []);

    const loadedImages = useLoadedMobileImages(images);

    useEffect(() => {
        if (!geojson || !routeTimes) {
            setLineSourceData(emptyCollection);
            setCurrentPointSourceData(emptyCollection);
            return;
        }

        const { line, currentPoint } = getRouteSourceData(
            { showRouteLine, showRoutePoints },
            geojson,
            routeTimes.startTimeEpoch,
            progressMs, // Not a dependency of this memo, data is updated later in the animateRoute hook
            bearingLineLengthInMeters
        );

        setLineSourceData(line);
        setCurrentPointSourceData(currentPoint);
    }, [geojson, routeTimes?.startTimeEpoch, bearingLineLengthInMeters, showRouteLine, showRoutePoints]);

    useEffect(() => {
        if (!isPlaying || !geojson || !routeTimes) {
            return;
        }
        playerOperator.animateRoute(loadedImages,
            (currentPoint, lines) => {
                setLineSourceData(lines);
                setCurrentPointSourceData(currentPoint);
            },
            (position, bearing) => {
                map.camera.current?.easeTo({
                    center: [position[0], position[1]],
                    duration: easeDuration,
                    zoom,
                    pitch,
                    bearing,
                });
            },
        );

        return () => {
            playerOperator.cleanupAnimateRoute();
        };
    }, [isPlaying, loadedImages, easeDuration, zoom, pitch]);

    return (
        <>
            <RouteLineLayer source={lineSourceData} />
            <RouteCurrentPointLayer source={currentPointSourceData} />
        </>
    );
};
