import { FC, useEffect, useMemo } from "react";
import { LayerSpecification, SourceSpecification } from "@maplibre/maplibre-gl-style-spec";
import maplibregl, { LngLat } from "maplibre-gl";
import bbox from "@turf/bbox";
import {
    OverlayComponentProps,
    useStateWarden,
    useSubjectState,
    useMapLayerData,
    MapLayerData,
    parsers,
    useMachineWard,
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

export const RouteLayer: FC<OverlayComponentProps<maplibregl.Map> & RouteToolProps<maplibregl.Map, File>> = ({
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
    const { chronoLens } = useMachineWard();
    const { animatrix, cartomancer, } = useStateWarden();
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
        playerOperator.animateRoute(loadedImages,
            (currentPoint, lines) => {
                updateRouteLayer(map, currentPoint, lines);
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

    return null;
};
