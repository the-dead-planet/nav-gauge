import { ComponentType, RefObject } from "react";
import { ToolPanelProps, ToolsStation, TopToolsProps } from "../../tools-station";
import { Icons } from "@ui";
import { Cartomancer, GaugeControlsType } from "../../cartomancer";
import { CompassOptions, ZoomOptions } from "../model";
import { AttributionVault } from "../../attribution-vault";

let zoomEndHandlerTimeout: Timer;

const attributionToolIconId = 'cartomancer-attribution';
const compassToolIconId = 'cartomancer-compass';
const zoomInIconId = 'cartomancer-zoom-in';
const currentZoomIconId = 'cartomancer-current-zoom';
const zoomOutIconId = 'cartomancer-zoom-out';
const mapLayoutControlsId = 'map-layout-controls';

export const addAttributionTool = <TMap>(
    toolsStation: ToolsStation<TMap>,
    component: ComponentType<TopToolsProps<TMap>>,
): (() => void) => {
    toolsStation.addTopTool(attributionToolIconId, component);

    return () => {
        toolsStation.removeTopTool(attributionToolIconId);
    };
};

export const addCompassToolIcon = <TMap>(
    gaugeControls: GaugeControlsType,
    toolsStation: ToolsStation<TMap>,
    cartomancer: Cartomancer<TMap>,
    getViewState: () => Promise<CompassOptions>,
    easeTo: ((options: CompassOptions) => void) | undefined,
): (() => void) => {
    const abortController = new AbortController();

    if (!gaugeControls.showCompass) {
        return () => { };
    }

    getViewState()
        .then(({ bearing, pitch }) => {
            if (abortController.signal.aborted) {
                return;
            }
            toolsStation.addToolIcon(compassToolIconId, {
                icon: Icons.NounProject.North as unknown as string,
                rotate: bearing,
                pitch,
                placement: 'right',
                tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.Compass },
                onClick: () => {
                    getViewState()
                        .then(({ center }) => {
                            if (abortController.signal.aborted) {
                                return;
                            }
                            easeTo?.({ center, bearing: 0, pitch: 0 });
                        })
                        .catch(console.error)
                },
            });
        })
        .catch((err) => {
            console.error(err);
        });

    return () => {
        abortController.abort();
        toolsStation.removeToolIcon(compassToolIconId);
    };
};

export const updateCompassIcon = <TMap>(
    toolsStation: ToolsStation<TMap>,
    { bearing, pitch }: { bearing: number; pitch: number },
) => {
    const compassToolIcon = toolsStation.toolIcons$.value.get(compassToolIconId);
    compassToolIcon?.rotate$.next(Math.round(bearing));
    compassToolIcon?.pitch$.next(Math.round(pitch));
};

export const addZoomToolIcons = <TMap>(
    gaugeControls: GaugeControlsType,
    toolsStation: ToolsStation<TMap>,
    cartomancer: Cartomancer<TMap>,
    clickedZoom: RefObject<number | null>,
    getViewState: () => Promise<ZoomOptions>,
    easeTo: ((options: ZoomOptions) => void) | undefined,
): (() => void) => {
    const abortController = new AbortController();

    if (!gaugeControls.showZoomButtons) {
        return () => { };
    }

    toolsStation.addToolIcon(zoomInIconId, {
        icon: Icons.NounProject.Plus as unknown as string,
        onClick: () => {
            getViewState()
                .then((viewState) => {
                    clickedZoom.current = Math.max((clickedZoom.current ?? 0) + 1, Math.floor(viewState.zoom + 1));
                    easeTo?.({ zoom: clickedZoom.current, center: viewState.center });
                });
        },
        placement: 'right',
        tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.ZoomIn },
    });

    toolsStation.addToolIcon(currentZoomIconId, {
        value: '20.0',
        onClick: () => {
            getViewState()
                .then((viewState) => {
                    easeTo?.({ zoom: Math.round(viewState.zoom), center: viewState.center });
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
        onClick: () => {
            getViewState()
                .then((viewState) => {
                    clickedZoom.current = Math.min((clickedZoom.current ?? 23) - 1, Math.ceil(viewState.zoom - 1));
                    easeTo?.({ zoom: clickedZoom.current, center: viewState.center });
                })
                .catch(console.error)
        },
        placement: 'right',
        tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.ZoomOut },
    });

    return () => {
        abortController.abort();
        toolsStation.removeToolIcon(zoomInIconId);
        toolsStation.removeToolIcon(currentZoomIconId);
        toolsStation.removeToolIcon(zoomOutIconId);
    };
};

export const updateCurrentZoomIcon = <TMap>(
    toolsStation: ToolsStation<TMap>,
    clickedZoom: RefObject<number | null>,
    getZoom: (() => Promise<number>) | undefined,
) => {
    clearTimeout(zoomEndHandlerTimeout);
    zoomEndHandlerTimeout = setTimeout(() => {
        getZoom?.()
            .then((mapZoom) => {
                clickedZoom.current = mapZoom;
            });
    }, 200);
    getZoom?.()
        .then((mapZoom) => {
            toolsStation.toolIcons$.value.get(currentZoomIconId)?.value$.next(mapZoom.toFixed(1));
        });
};

export const addMapLayoutToolPanel = <TMap>(
    contentComponent: ComponentType<ToolPanelProps<TMap>>,
    toolsStation: ToolsStation<TMap>,
    cartomancer: Cartomancer<TMap>,
): (() => void) => {
    toolsStation.addToolPanel(mapLayoutControlsId, {
        title: { n: cartomancer.namespace, t: cartomancer.translationKey.CartoConfig },
        contentComponent,
        icon: Icons.NounProject.MapLayout as unknown as string,
        placement: 'left'
    });

    return () => {
        toolsStation.removeToolPanel(mapLayoutControlsId);
    };
};
