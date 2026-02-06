import { FC, useEffect } from "react";
import { OverlayComponentProps, useSubjectState } from "@apparatus";
import { RouteToolProps } from "@the-dead-planet/nav-gauge-gears-route-story";
import { View } from "react-native";
import { Text } from "@mobile-ui";
import { MobileMap } from "@the-dead-planet/nav-gauge-mobile-ui/src/model";
import { CircleLayer, LineLayer, ShapeSource } from "@maplibre/maplibre-react-native";

export const RouteLayer: FC<OverlayComponentProps<MobileMap> & RouteToolProps> = ({
    map,
    data$,
    routeTimes$,
    images$,
    progressMs$,
}) => {
    const [{ geojson }, setData] = useSubjectState(data$);

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

    return (
        <ShapeSource id="test" shape={geojson}>
            <CircleLayer id="test-line" style={{
                circleColor: '#ff0000',
                circleRadius: 4,
            }} />
        </ShapeSource>
    );
};
