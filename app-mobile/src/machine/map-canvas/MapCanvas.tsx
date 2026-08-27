import { FC, ReactNode, useEffect, useRef } from "react";
import { BehaviorSubject } from "rxjs";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import { RecordingView, useViewRecorder } from "react-native-view-recorder";
import { Camera, Map as MaplibreMap, LogManager } from "@maplibre/maplibre-react-native";
import { Cartomancer, updateCompassIcon, updateCurrentZoomIcon } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap, useMobileMachineWard } from "@mobile-apparatus";
import { useMapTools } from "./useMapTools";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    },
    mapView: {
        flex: 1,
    },
});

export const dragPan$ = new BehaviorSubject(true);
export const onPressHandlers$ = new BehaviorSubject(new Map());
export const onLongPressHandlers$ = new BehaviorSubject(new Map());
export const onPanResponderStartHandlers$ = new BehaviorSubject(new Map());
export const onPanResponderMoveHandlers$ = new BehaviorSubject(new Map());
export const onPanResponderEndHandlers$ = new BehaviorSubject(new Map());

interface Props {
    map: MobileMap;
    /**
     * Will be unmounted for the duration of style updates.
     */
    children?: ReactNode;
}

export const MapCanvas: FC<Props> = ({
    map,
    children,
}) => {
    const viewRecorderRef = useRef(null);
    const recorder = useViewRecorder();
    const { cartomancer, chronoLens, signaliumBureau, toolsStation } = useMobileMachineWard();
    const [dragPan] = useSubjectState(map.dragPan$);
    const [isInitialised, setIsInitialised] = useSubjectState(cartomancer.isInitialised$);
    const [isStyleLoaded, setIsStyleLoaded] = useSubjectState(cartomancer.isStyleLoaded$);
    const [selectedStyle] = useSubjectState(cartomancer.selectedStyle$);
    const [onPressHandlers] = useSubjectState(map.onPressHandlers$);
    const [onLongPressHandlers] = useSubjectState(map.onLongPressHandlers$);
    const clickedZoom = useRef<number>(null);

    useEffect(() => {
        const abortController = new AbortController();
        chronoLens.viewRecorder = recorder;
        chronoLens.setUpSurveillance(signaliumBureau, abortController.signal);

        return () => {
            abortController.abort();
            chronoLens.viewRecorder = null;
            chronoLens.clearSurveillance();
        };
    }, [recorder]);

    const handleLayoutChange = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        map.mapSize$.next({ width, height })
    };

    useEffect(() => {
        const notificationId = 'maplibre-map';

        LogManager.onLog((event) => {
            if (event.level === 'error') {
                signaliumBureau.addNotice({
                    id: notificationId,
                    type: 'error',
                    text: `${event.message} (${event.tag})`,
                    error: new Error(event.message, { cause: event.tag }),
                });
            }

            return true;
        });

        return () => {
            signaliumBureau.removeNotice(notificationId);
        };
    }, []);

    useMapTools(map);

    return (
        <RecordingView
            ref={viewRecorderRef}
            sessionId={recorder.sessionId}
            style={StyleSheet.absoluteFill}
            onLayout={handleLayoutChange}
        >
            <MaplibreMap
                ref={(r) => map.map$.next(r)}
                style={styles.mapView}
                dragPan={dragPan}
                mapStyle={Cartomancer.styles[selectedStyle.id]?.style}
                onDidFinishRenderingMapFully={() => setIsInitialised(true)}
                onDidFinishLoadingStyle={() => setIsStyleLoaded(true)}
                logo={false}
                scaleBar={false}
                onDidFailLoadingMap={() => {
                    signaliumBureau.addNotice({
                        id: 'map-failed',
                        type: 'error',
                        error: new Error('Map loading failed'),
                        text: 'Something went wrong'
                    })
                }}
                onRegionDidChange={(event) => {
                    const bearing = event.nativeEvent.bearing;
                    const pitch = event.nativeEvent.pitch;
                    cartomancer.zoom$.next(parseFloat(event.nativeEvent.zoom.toFixed(1)));
                    cartomancer.bearing$.next(bearing);
                    updateCompassIcon(toolsStation, { bearing, pitch });
                    updateCurrentZoomIcon(toolsStation, clickedZoom, map.map$.value?.getZoom);
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
                <Camera ref={(r) => map.camera$.next(r)} />
                {isInitialised && isStyleLoaded ? children : null}
            </MaplibreMap>
        </RecordingView>
    );
};
