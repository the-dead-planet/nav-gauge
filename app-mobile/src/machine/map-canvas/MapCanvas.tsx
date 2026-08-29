import { FC, ReactNode, useEffect, useRef } from "react";
import { BehaviorSubject } from "rxjs";
import { Animated, LayoutChangeEvent, StyleSheet } from "react-native";
import { RecordingView, useViewRecorder } from "react-native-view-recorder";
import { Camera, Map as MaplibreMap, LogManager, StyleSpecification } from "@maplibre/maplibre-react-native";
import { Cartomancer, SurveillanceState, updateCompassIcon, updateCurrentZoomIcon } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap, useMobileMachineWard } from "@mobile-apparatus";
import { DesignSystemColor, ThemeComponentColor, useTheme } from "@ui";
import { useMapTools } from "./useMapTools";

const styles = StyleSheet.create({
    mapView: {
        flex: 1,
    },
    onTop: {
        zIndex: 2,
    },
    blinkBorder: {
        ...StyleSheet.absoluteFill,
        borderWidth: 4,
        pointerEvents: 'none',
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
    const theme = useTheme();
    const { cartomancer, chronoLens, signaliumBureau, toolsStation } = useMobileMachineWard();
    const [dragPan] = useSubjectState(map.dragPan$);
    const [surveillanceState] = useSubjectState(chronoLens.surveillanceState$);
    const [isInitialised, setIsInitialised] = useSubjectState(cartomancer.isInitialised$);
    const [isStyleLoaded, setIsStyleLoaded] = useSubjectState(cartomancer.isStyleLoaded$);
    const [selectedStyle] = useSubjectState(cartomancer.selectedStyle$);
    const [blinkingState] = useSubjectState(cartomancer.blinkingState$);
    const [onPressHandlers] = useSubjectState(map.onPressHandlers$);
    const [onLongPressHandlers] = useSubjectState(map.onLongPressHandlers$);
    const clickedZoom = useRef<number>(null);
    const blinkOpacity = useRef(new Animated.Value(1)).current;

    const isComponentColor = (color: ThemeComponentColor | DesignSystemColor): color is ThemeComponentColor =>
        (['background', 'border', 'box-shadow', 'divider', 'text', 'error', 'warning', 'success', 'info'] as ThemeComponentColor[]).includes(color as ThemeComponentColor);

    const blinkBorderColor = blinkingState
        ? isComponentColor(blinkingState.color)
            ? theme.componentColor(blinkingState.color)
            : theme.color(blinkingState.color, 500)
        : undefined;

    useEffect(() => {
        const blinkAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(blinkOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
                Animated.timing(blinkOpacity, { toValue: 0, duration: 100, useNativeDriver: true }),
                Animated.timing(blinkOpacity, { toValue: 0, duration: 450, useNativeDriver: true }),
            ])
        );
        blinkAnimation.start();

        return () => blinkAnimation.stop();
    }, [blinkOpacity]);

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
        <>
            <RecordingView
                ref={viewRecorderRef}
                sessionId={recorder.sessionId}
                style={[
                    StyleSheet.absoluteFill,
                    surveillanceState === SurveillanceState.InProgress ? styles.onTop : undefined,
                ]}
                onLayout={handleLayoutChange}
            >
                <MaplibreMap
                    ref={(r) => map.map$.next(r)}
                    style={styles.mapView}
                    androidView="texture"
                    dragPan={dragPan}
                    mapStyle={Cartomancer.styles[selectedStyle.id]?.style as StyleSpecification}
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
            {blinkingState ? (
                <Animated.View
                    pointerEvents="none"
                    style={[styles.blinkBorder, { borderColor: blinkBorderColor }, { opacity: blinkOpacity }]}
                />
            ) : null}
        </>
    );
};
