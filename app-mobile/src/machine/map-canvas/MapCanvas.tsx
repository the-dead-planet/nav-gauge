import { FC, ReactNode, RefObject, useEffect, useRef } from "react";
import { BehaviorSubject } from "rxjs";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import { RecordingView, useViewRecorder } from "react-native-view-recorder";
import { Camera, Map as MaplibreMap } from "@maplibre/maplibre-react-native";
import { Cartomancer, ToolsStation, useMachineWard } from "@apparatus";
import { Icons } from "@ui";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-ui";
import { MobileChronoLens } from "@mobile-apparatus";
import { CartoConfigPanel } from "../controls/CartoConfigPanel";

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

const compassToolIconId = 'cartomancer-compass';
const zoomInIconId = 'cartomancer-zoom-in';
const currentZoomIconId = 'cartomancer-current-zoom';
const zoomOutIconId = 'cartomancer-zoom-out';

const updateCompassIcon = (
    toolsStation: ToolsStation<MobileMap>,
    { bearing, pitch }: { bearing: number; pitch: number },
) => {
    const compassToolIcon = toolsStation.toolIcons$.value.get(compassToolIconId);
    compassToolIcon?.rotate$.next(Math.round(bearing));
    compassToolIcon?.pitch$.next(Math.round(pitch));
};

let zoomEndHandlerTimeout: number;
const updateCurrentZoomIcon = (
    toolsStation: ToolsStation<MobileMap>,
    map: MobileMap,
    clickedZoom: RefObject<number | null>,
) => {
    clearTimeout(zoomEndHandlerTimeout);
    zoomEndHandlerTimeout = setTimeout(() => {
        map.map$.value?.getZoom()
            .then((mapZoom) => {
                clickedZoom.current = mapZoom;
            });
    }, 200);
    map.map$.value?.getZoom()
        .then((mapZoom) => {
            toolsStation.toolIcons$.value.get(currentZoomIconId)?.value$.next(mapZoom.toFixed(1));
        });
};

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
    const [_isInitialised, setIsInitialised] = useSubjectState(cartomancer.isInitialised$);
    const [_isStyleLoaded, setIsStyleLoaded] = useSubjectState(cartomancer.isStyleLoaded$);
    const [selectedStyle] = useSubjectState(cartomancer.selectedStyle$);
    const [_mapZoom, setMapZoom] = useSubjectState(cartomancer.zoom$);
    const [_mapBearing, setMapBearing] = useSubjectState(cartomancer.bearing$);
    const [onPressHandlers] = useSubjectState(map.onPressHandlers$);
    const [onLongPressHandlers] = useSubjectState(map.onLongPressHandlers$);
    const [gaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const clickedZoom = useRef<number>(null);

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

    useEffect(() => {
        const mapLayoutControlsId = 'map-layout-controls';
        toolsStation.addToolPanel(mapLayoutControlsId, {
            title: { n: cartomancer.namespace, t: cartomancer.translationKey.CartoConfig },
            contentComponent: CartoConfigPanel,
            icon: Icons.NounProject.MapLayout as unknown as string,
            placement: 'left'
        });

        return () => {
            toolsStation.removeToolPanel(mapLayoutControlsId);
        };
    }, []);

    useEffect(() => {
        const m = map.map$.value;
        if (!m || !gaugeControls.showCompass) {
            return;
        }
        toolsStation.addToolIcon(compassToolIconId, {
            icon: Icons.NounProject.North as unknown as string,
            onClick: (map) => {
                map.map$.value?.getCenter()
                    .then((center) => {
                        map.camera$.value?.easeTo({ bearing: 0, pitch: 0, center });
                    })
                    .catch(console.error);
            },
            placement: 'left',
            tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.Compass },
        });

        return () => {
            toolsStation.removeToolIcon(compassToolIconId);
        };
    }, [gaugeControls.showCompass]);

    useEffect(() => {
        if (!gaugeControls.showZoomButtons) {
            return;
        }

        toolsStation.addToolIcon(zoomInIconId, {
            icon: Icons.NounProject.Plus as unknown as string,
            onClick: (map) => {
                map.map$.value?.getViewState()
                    .then((viewState) => {
                        clickedZoom.current = Math.max((clickedZoom.current ?? 0) + 1, Math.floor(viewState.zoom + 1));
                        map.camera$.value?.easeTo({ zoom: clickedZoom.current, center: viewState.center });
                    });
            },
            placement: 'left',
            tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.ZoomIn },
        });

        toolsStation.addToolIcon(currentZoomIconId, {
            value: '20.0',
            onClick: (map) => {
                map.map$.value?.getViewState()
                    .then((viewState) => {
                        map.camera$.value?.easeTo({ zoom: Math.round(viewState.zoom), center: viewState.center });
                    })
                    .catch(console.error);
            },
            placement: 'right',
            tooltip: (value) => ({
                n: cartomancer.namespace,
                t: cartomancer.translationKey.RoundCurrentZoom,
                p: typeof value === 'string' ? { zoom: Number(value).toFixed(0) } : undefined,
            }),
        });

        toolsStation.addToolIcon(zoomOutIconId, {
            icon: Icons.NounProject.Minus as unknown as string,
            onClick: (map) => {
                map.map$.value?.getViewState()
                    .then((viewState) => {
                        clickedZoom.current = Math.min((clickedZoom.current ?? 23) - 1, Math.ceil(viewState.zoom - 1));
                        map.camera$.value?.easeTo({ zoom: clickedZoom.current, center: viewState.center });
                    })
                    .catch(console.error)
            },
            placement: 'right',
            tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.ZoomOut },
        });

        return () => {
            toolsStation.removeToolIcon(zoomInIconId);
            toolsStation.removeToolIcon(currentZoomIconId);
            toolsStation.removeToolIcon(zoomOutIconId);
        };
    }, [gaugeControls.showZoomButtons]);

    useEffect(() => {
        const mapLayoutControlsId = 'map-layout-controls';
        toolsStation.addToolPanel(mapLayoutControlsId, {
            title: { n: cartomancer.namespace, t: cartomancer.translationKey.CartoConfig },
            contentComponent: CartoConfigPanel,
            icon: Icons.NounProject.MapLayout as unknown as string,
            placement: 'left'
        });

        return () => {
            toolsStation.removeToolPanel(mapLayoutControlsId);
        };
    }, []);


    const handleLayoutChange = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        map.mapSize$.next({ width, height })
    };

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
                    const bearing = event.nativeEvent.bearing;
                    const pitch = event.nativeEvent.pitch;

                    setMapZoom(parseFloat(event.nativeEvent.zoom.toFixed(1)));
                    setMapBearing(bearing);
                    updateCompassIcon(toolsStation, { bearing, pitch });
                    updateCurrentZoomIcon(toolsStation, map, clickedZoom);
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
                {children}
            </MaplibreMap>
        </RecordingView>
    );
};
