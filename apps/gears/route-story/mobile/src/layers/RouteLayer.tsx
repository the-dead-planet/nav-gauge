import { FC, useEffect, useMemo, useRef } from "react";
import { BehaviorSubject } from "rxjs";
import { ShapeSourceRef } from "@maplibre/maplibre-react-native";
import { OverlayComponentProps, useStateWarden, useSubjectState } from "@apparatus";
import { getRouteSourceData, RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-ui";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { useLoadedMobileImages } from "../images/useLoadedMobileImages";
import { MobileMarkerImageData } from "../images/image-parser";
import { RouteLineLayer } from "./RouteLineLayer";
import { RouteCurrentPointLayer } from "./RouteCurrentPointLayer";
import { emptyCollection } from "@tinker-chest";

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
        easeDuration,
        bearingLineLengthInMeters,
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
        [key in 'line' | 'currentPoint']: GeoJSON.GeoJSON;
    } => {
        if (!geojson || !routeTimes) {
            return { line: emptyCollection, currentPoint: emptyCollection };
        }

        const { currentPoint, line } = getRouteSourceData(
            { showRouteLine, showRoutePoints },
            geojson,
            routeTimes.startTimeEpoch,
            progressMs, // Not a dependency of this memo, data is updated later in the animateRoute hook
            bearingLineLengthInMeters
        );

        return {
            line,
            currentPoint
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

    return (
        <>
            <RouteLineLayer sourceRef={lineSourceRef} source={sources.line} />
            <RouteCurrentPointLayer sourceRef={pointSourceRef} source={sources.currentPoint} />
        </>
    );
};
