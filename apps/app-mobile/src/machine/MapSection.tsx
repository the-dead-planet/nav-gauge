import { FC, useEffect, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, PanResponder, StyleSheet } from "react-native";
import { RecordingView, useViewRecorder } from "react-native-view-recorder";
import { Camera, CameraRef, MapView, MapViewRef, UserLocation, UserLocationRef } from "@maplibre/maplibre-react-native";
import { Cartomancer, useSubjectState, useStateWarden } from "@apparatus";
import { MapTools } from "./map-tools/MapTools";
import { MobileMap, PressEventFeature } from "@mobile-ui";
import { MobileChronoLens } from "../chrono-lens";
import { BehaviorSubject } from "rxjs";

const styles = StyleSheet.create({
    viewRecorder: {
        flex: 1,
        position: 'relative'
    },
    mapView: {
        flex: 1,
    }
});

const scrollEnabled$ = new BehaviorSubject(true);
const onPressHandlers$ = new BehaviorSubject(new Map());
const onLongPressHandlers$ = new BehaviorSubject(new Map());
const onTouchMoveHandlers$ = new BehaviorSubject(new Map());

export const MapSection: FC = () => {
    const mapRef = useRef<MapViewRef>(null);
    const cameraRef = useRef<CameraRef>(null);
    const userLocationRef = useRef<UserLocationRef>(null);
    const viewRecorderRef = useRef(null);
    const recorder = useViewRecorder();
    const [mapSize, setMapSize] = useState<{ width: number; height: number; }>({ width: 100, height: 100 });
    const map = useMemo((): MobileMap => ({
        map: mapRef,
        camera: cameraRef,
        userLocation: userLocationRef,
        width: mapSize.width,
        height: mapSize.height,
        scrollEnabled$,
        onPressHandlers$,
        onLongPressHandlers$,
        onTouchMoveHandlers$,
    }), [mapSize]);
    const { cartomancer, chronoLens, signaliumBureau } = useStateWarden();
    const lens = chronoLens as MobileChronoLens;
    const [scrollEnabled] = useSubjectState(map.scrollEnabled$);
    const [_isInitialised, setIsInitialised] = useSubjectState(cartomancer.isInitialised$);
    const [_isStyleLoaded, setIsStyleLoaded] = useSubjectState(cartomancer.isStyleLoaded$);
    const [selectedStyle] = useSubjectState(cartomancer.selectedStyle$);
    const [_mapZoom, setMapZoom] = useSubjectState(cartomancer.zoom$);
    const [_mapBearing, setMapBearing] = useSubjectState(cartomancer.bearing$);
    const [overlays] = useSubjectState(cartomancer.overlays$);
    const [onPressHandlers] = useSubjectState(map.onPressHandlers$);
    const [onLongPressHandlers] = useSubjectState(map.onLongPressHandlers$);
    const [onTouchMoveHandlers] = useSubjectState(map.onTouchMoveHandlers$);

    useEffect(() => {
        setIsInitialised(true);
        setIsStyleLoaded(true);
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        lens.viewRecorder = recorder;
        chronoLens.setUpSurveillance(signaliumBureau, abortController.signal);

        return () => {
            abortController.abort();
            lens.viewRecorder = null;
            chronoLens.clearSurveillance();
        };
    }, [recorder]);

    const handleLayoutChange = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setMapSize({ width, height })
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: async (event) => {
            const { locationX, locationY } = event.nativeEvent;

            if (map.map.current) {
                const lngLat = await map.map.current.getCoordinateFromView([locationX, locationY]);

                for (const [_handlerId, handler] of onTouchMoveHandlers) {
                    handler(lngLat, event);
                }
            }
        },
        onPanResponderEnd: (_event) => {
            map.scrollEnabled$.next(true);
        }
    });

    return (
        <MapTools map={map}>
            <RecordingView
                ref={viewRecorderRef}
                sessionId={recorder.sessionId}
                style={styles.viewRecorder}
                onLayout={handleLayoutChange}
                {...panResponder.panHandlers}
            >
                <MapView
                    ref={mapRef}
                    style={styles.mapView}
                    scrollEnabled={scrollEnabled}
                    mapStyle={Cartomancer.styles[selectedStyle.id]?.style}
                    onDidFinishLoadingMap={() => setIsInitialised(true)}
                    onDidFinishLoadingStyle={() => setIsStyleLoaded(true)}
                    onDidFailLoadingMap={() => {
                        signaliumBureau.addNotice({
                            id: 'map-failed',
                            type: 'error',
                            error: new Error('Map loading failed'),
                            text: 'Something went wrong'
                        })
                    }}
                    onRegionDidChange={(feature) => {
                        setMapZoom(parseFloat(feature.properties.zoomLevel.toFixed(1)));
                        setMapBearing(feature.properties.heading);
                    }}
                    onPress={(feature) => {
                        for (const [_handlerId, handler] of onPressHandlers) {
                            handler(feature as PressEventFeature);
                        }
                    }}
                    onLongPress={(feature) => {
                        for (const [_handlerId, handler] of onLongPressHandlers) {
                            handler(feature as PressEventFeature);
                        }
                    }}
                >
                    <Camera ref={cameraRef} />
                    <UserLocation ref={userLocationRef} visible={false} onUpdate={(_location) => { }} />
                    {[...overlays.entries()].map(([id, OverlayComponent]) => (
                        <OverlayComponent key={id} map={map} />
                    ))}
                </MapView>
            </RecordingView>
        </MapTools>
    );
};
