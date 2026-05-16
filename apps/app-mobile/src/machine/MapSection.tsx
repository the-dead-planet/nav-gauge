import { FC, useEffect, useMemo, useRef, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import { RecordingView, useViewRecorder } from "react-native-view-recorder";
import { Camera, CameraRef, Map as MaplibreMap, MapRef } from "@maplibre/maplibre-react-native";
import { Cartomancer, useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-ui";
import { MapTools } from "./map-tools/MapTools";
import { MobileChronoLens } from "@mobile-apparatus";

const styles = StyleSheet.create({
    viewRecorder: {
        flex: 1,
        position: 'relative',
        borderColor: "1px",
        borderWidth: 10,
        borderStyle: "dashed",
    },
    mapView: {
        flex: 1,
    }
});

const dragPan$ = new BehaviorSubject(true);
const onPressHandlers$ = new BehaviorSubject(new Map());
const onLongPressHandlers$ = new BehaviorSubject(new Map());
const onPanResponderStartHandlers$ = new BehaviorSubject(new Map());
const onPanResponderMoveHandlers$ = new BehaviorSubject(new Map());
const onPanResponderEndHandlers$ = new BehaviorSubject(new Map());

export const MapSection: FC = () => {
    const mapRef = useRef<MapRef>(null);
    const cameraRef = useRef<CameraRef>(null);
    const viewRecorderRef = useRef(null);
    const recorder = useViewRecorder();
    const [mapSize, setMapSize] = useState<{ width: number; height: number; }>({ width: 100, height: 100 });
    const map = useMemo((): MobileMap => ({
        map: mapRef,
        camera: cameraRef,
        width: mapSize.width,
        height: mapSize.height,
        dragPan$,
        onPressHandlers$,
        onLongPressHandlers$,
        onPanResponderStartHandlers$,
        onPanResponderMoveHandlers$,
        onPanResponderEndHandlers$,
    }), [mapSize]);
    const { cartomancer, chronoLens, signaliumBureau } = useMachineWard();
    const lens = chronoLens as MobileChronoLens;
    const [dragPan] = useSubjectState(map.dragPan$);
    const [_isInitialised, setIsInitialised] = useSubjectState(cartomancer.isInitialised$);
    const [_isStyleLoaded, setIsStyleLoaded] = useSubjectState(cartomancer.isStyleLoaded$);
    const [selectedStyle] = useSubjectState(cartomancer.selectedStyle$);
    const [_mapZoom, setMapZoom] = useSubjectState(cartomancer.zoom$);
    const [_mapBearing, setMapBearing] = useSubjectState(cartomancer.bearing$);
    const [overlays] = useSubjectState(cartomancer.overlays$);
    const [onPressHandlers] = useSubjectState(map.onPressHandlers$);
    const [onLongPressHandlers] = useSubjectState(map.onLongPressHandlers$);

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

    // const currentPosition = useCurrentPosition({ enabled: true, minDisplacement: 1});

    return (
        <MapTools map={map}>
            <RecordingView
                ref={viewRecorderRef}
                sessionId={recorder.sessionId}
                style={styles.viewRecorder}
                onLayout={handleLayoutChange}
            >
                <MaplibreMap
                    ref={mapRef}
                    style={styles.mapView}
                    dragPan={dragPan}
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
                    onRegionDidChange={(event) => {
                        setMapZoom(parseFloat(event.nativeEvent.zoom.toFixed(1)));
                        setMapBearing(event.nativeEvent.bearing);
                    }}
                    onPress={(event) => {
                        for (const [_handlerId, handler] of onPressHandlers) {
                            handler(event.nativeEvent);
                        }
                    }}
                    onLongPress={(event) => {
                        for (const [_handlerId, handler] of onLongPressHandlers) {
                            handler(event.nativeEvent);
                        }
                    }}
                >
                    <Camera ref={cameraRef} />
                    {/* <NativeUserLocation mode="heading" />
                    <UserLocation /> */}
                    {[...overlays.entries()].map(([id, OverlayComponent]) => (
                        <OverlayComponent key={id} map={map} />
                    ))}
                </MaplibreMap>
            </RecordingView>
        </MapTools>
    );
};
