import { FC, ReactNode, useEffect, useMemo, useRef } from "react";
import { BehaviorSubject } from "rxjs";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import { RecordingView, useViewRecorder } from "react-native-view-recorder";
import { Camera, Map as MaplibreMap, LogManager } from "@maplibre/maplibre-react-native";
import { Cartomancer, updateCompassIcon, updateCurrentZoomIcon, useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-ui";
import { MobileChronoLens } from "@mobile-apparatus";
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
    const { cartomancer, chronoLens, signaliumBureau, toolsStation } = useMachineWard<MobileMap>();
    const lens = chronoLens as MobileChronoLens;
    const [dragPan] = useSubjectState(map.dragPan$);
    const [isInitialised, setIsInitialised] = useSubjectState(cartomancer.isInitialised$);
    const [isStyleLoaded, setIsStyleLoaded] = useSubjectState(cartomancer.isStyleLoaded$);
    const [selectedStyle] = useSubjectState(cartomancer.selectedStyle$);
    const [onPressHandlers] = useSubjectState(map.onPressHandlers$);
    const [onLongPressHandlers] = useSubjectState(map.onLongPressHandlers$);
    const clickedZoom = useRef<number>(null);

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

    useMapTools(map);

    const handleLayoutChange = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        map.mapSize$.next({ width, height })
    };


    useEffect(() => {
        const notificationId = 'maplibre-map';

        LogManager.onLog((event) => {
            console.log(Cartomancer.styles[selectedStyle.id]?.style)
            if (event.level === 'error' || event.level === 'warn') {
                console.log("map logger", event); // TODO: Delete the log
                signaliumBureau.addNotice({
                    id: notificationId,
                    type: event.level === 'error' ? 'error' : 'warning',
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

    const effectiveStyle = useMemo(() => {
        const s = Cartomancer.styles[selectedStyle.id];

        if (typeof s.style !== 'string') {
            for (const k in s.style.sources) {
                const source = s.style.sources[k];
                if (source.type === 'vector' && source.url?.startsWith("pmtiles:///tiles")) {
                    source.url = source.url.replace("pmtiles:///tiles", "pmtiles://asset://tiles");
                }
            }
        }
        console.log(s.style);
        return s?.style;
    }, [selectedStyle.id]);

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
                mapStyle={effectiveStyle}
                onDidFinishRenderingMapFully={(event) => {
                    console.log(event);
                    setIsInitialised(true);
                }}
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
