import { useEffect, useRef } from "react";
import {
    addCompassToolIcon,
    currentZoomIconId,
    mapLayoutControlsId,
    useMachineWard,
    zoomInIconId,
    zoomOutIconId
} from "@apparatus";
import { Icons } from "@ui";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-ui";
import { CartoConfigPanel } from "../controls/CartoConfigPanel";

export const useMapTools = (map: MobileMap) => {
    const { cartomancer, toolsStation } = useMachineWard<MobileMap>();
    const [isInitialised] = useSubjectState(cartomancer.isInitialised$);
    const [gaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const clickedZoom = useRef<number>(null);

    useEffect(() => {
        const m = map.map$.value;
        if (!isInitialised || !m) {
            return;
        }

        return addCompassToolIcon(
            gaugeControls,
            toolsStation,
            cartomancer,
            m.getViewState,
            map.camera$.value?.easeTo,
        );
    }, [isInitialised, gaugeControls.showCompass]);

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
            placement: 'right',
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
};
