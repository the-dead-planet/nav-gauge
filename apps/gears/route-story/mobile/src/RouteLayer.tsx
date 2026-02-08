import { FC, useEffect, useMemo } from "react";
import { CircleLayer, CircleLayerStyle, LineLayer, LineLayerStyle, ShapeSource } from "@maplibre/maplibre-react-native";
import { OverlayComponentProps, useStateWarden, useSubjectState } from "@apparatus";
import { getRouteSourceData, RouteToolProps, sourceIds, layerIds, colorActive, colorInactive, routeLineLayer, currentPointLayers, routePointsLayer } from "@the-dead-planet/nav-gauge-gears-route-story";
import { MobileMap } from "@the-dead-planet/nav-gauge-mobile-ui";
import { LayerSpecification } from "@maplibre/maplibre-gl-style-spec";

export const RouteLayer: FC<OverlayComponentProps<MobileMap> & RouteToolProps> = ({
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
        // fetch('/example.gpx')
        //     .then((file) => file.text())
        //     .then((text) => parsers.get('.gpx')?.parseTextToGeoJson(text))
        //     .then((result) => setData(result ? {
        //         ...result,
        //         boundingBox: bbox(result.geojson)
        //     } : {}));
        setData({
            "geojson": {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "id": 0,
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                6.0301,
                                45.0512,
                                720
                            ]
                        },
                        "properties": {
                            "id": 0,
                            "time": "2025-07-31T08:00:00Z"
                        }
                    },
                    {
                        "type": "Feature",
                        "id": 1,
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                6.0358,
                                45.0573,
                                800
                            ]
                        },
                        "properties": {
                            "id": 1,
                            "time": "2025-07-31T08:10:00Z"
                        }
                    },
                    {
                        "type": "Feature",
                        "id": 2,
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                6.0432,
                                45.065,
                                950
                            ]
                        },
                        "properties": {
                            "id": 2,
                            "time": "2025-07-31T08:25:00Z"
                        }
                    },
                    {
                        "type": "Feature",
                        "id": 3,
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                6.0501,
                                45.0719,
                                1100
                            ]
                        },
                        "properties": {
                            "id": 3,
                            "time": "2025-07-31T08:40:00Z"
                        }
                    },
                    {
                        "type": "Feature",
                        "id": 4,
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                6.0603,
                                45.0783,
                                1250
                            ]
                        },
                        "properties": {
                            "id": 4,
                            "time": "2025-07-31T09:00:00Z"
                        }
                    },
                    {
                        "type": "Feature",
                        "id": 5,
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                6.0708,
                                45.088,
                                1450
                            ]
                        },
                        "properties": {
                            "id": 5,
                            "time": "2025-07-31T09:20:00Z"
                        }
                    },
                    {
                        "type": "Feature",
                        "id": 6,
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                6.0713,
                                45.0918,
                                1860
                            ]
                        },
                        "properties": {
                            "id": 6,
                            "time": "2025-07-31T09:45:00Z"
                        }
                    },
                    {
                        "type": "Feature",
                        "id": 7,
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                6.0735,
                                45.0928,
                                1850
                            ]
                        },
                        "properties": {
                            "id": 7,
                            "time": "2025-07-31T09:50:00Z"
                        }
                    },
                    {
                        "type": "Feature",
                        "id": 8,
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                6.0505,
                                45.0803,
                                1200
                            ]
                        },
                        "properties": {
                            "id": 8,
                            "time": "2025-07-31T10:20:00Z"
                        }
                    },
                    {
                        "type": "Feature",
                        "id": 9,
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                6.0352,
                                45.063,
                                850
                            ]
                        },
                        "properties": {
                            "id": 9,
                            "time": "2025-07-31T10:50:00Z"
                        }
                    },
                    {
                        "type": "Feature",
                        "id": 10,
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                6.0301,
                                45.0512,
                                720
                            ]
                        },
                        "properties": {
                            "id": 10,
                            "time": "2025-07-31T11:10:00Z"
                        }
                    }
                ]
            },
            "routeName": "Alpe d'Huez Road Bike Loop",
            "boundingBox": [
                6.0301,
                45.0512,
                6.0735,
                45.0928
            ]
        });
    }, []);

    const sources = useMemo((): {
        [key in string]?: GeoJSON.GeoJSON;
    } | null => {
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
                                lineOpacity: routeLineLayer.paint?.["line-opacity"]!
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
