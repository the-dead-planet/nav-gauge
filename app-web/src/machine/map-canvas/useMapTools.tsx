import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { Icons } from "@ui";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { CartoConfigPanel } from "../controls/CartoConfigPanel";

export const useMapTools = (map: maplibregl.Map) => {
    const { cartomancer, toolsStation } = useMachineWard<maplibregl.Map>();
    const [gaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const clickedZoom = useRef(map.getZoom());

    useEffect(() => {
        if (!gaugeControls.showCompass) {
            return;
        }
        const id = 'cartomancer-compass';
        const toolIcon = toolsStation.addToolIcon(id, {
            icon: Icons.NounProject.North,
            onClick: (map) => {
                map.setBearing(0);
                map.setPitch(0);
            },
            placement: 'right',
            tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.Compass },
        });

        const rotateHandler = () => {
            toolIcon.rotate$.next(Math.round(map.getBearing()));
        };
        const pitchHandler = () => {
            toolIcon.pitch$.next(Math.round(map.getPitch()));
        };

        map.on('rotate', rotateHandler);
        map.on('pitch', pitchHandler);

        return () => {
            map.off('rotate', rotateHandler);
            map.off('pitch', pitchHandler);
            toolsStation.removeToolIcon(id);
        };
    }, [gaugeControls.showCompass]);

    useEffect(() => {
        if (!gaugeControls.showZoomButtons) {
            return;
        }
        const idIn = 'cartomancer-zoom-in';
        toolsStation.addToolIcon(idIn, {
            icon: Icons.NounProject.Plus,
            onClick: (map) => {
                clickedZoom.current = Math.max(clickedZoom.current + 1, Math.floor(map.getZoom() + 1));
                map.easeTo({ zoom: clickedZoom.current });
            },
            placement: 'right',
            tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.ZoomIn },
        });

        const idCurrentZoom = 'cartomancer-current-zoom';
        const currentZoomIcon = toolsStation.addToolIcon(idCurrentZoom, {
            value: map.getZoom().toFixed(1),
            onClick: (map) => {
                map.easeTo({ zoom: Math.round(map.getZoom()) });
            },
            placement: 'right',
            tooltip: (value) => ({
                n: cartomancer.namespace,
                t: cartomancer.translationKey.RoundCurrentZoom,
                p: typeof value === 'string' ? { zoom: Number(value).toFixed(0) } : undefined,
            }),
        });

        const idOut = 'cartomancer-zoom-out';
        toolsStation.addToolIcon(idOut, {
            icon: Icons.NounProject.Minus,
            onClick: (map) => {
                clickedZoom.current = Math.min(clickedZoom.current - 1, Math.ceil(map.getZoom() - 1));
                map.easeTo({ zoom: clickedZoom.current });
            },
            placement: 'right',
            tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.ZoomOut },
        });

        let timeout: number;
        const zoomEndHandler = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => clickedZoom.current = map.getZoom(), 200);
            currentZoomIcon.value$.next(map.getZoom().toFixed(1));
        };

        map.on("zoomend", zoomEndHandler);

        return () => {
            map.off("zoomend", zoomEndHandler);
            toolsStation.removeToolIcon(idIn);
            toolsStation.removeToolIcon(idCurrentZoom);
            toolsStation.removeToolIcon(idOut);
        };
    }, [gaugeControls.showZoomButtons]);

    useEffect(() => {
        const mapLayoutControlsId = 'map-layout-controls';
        toolsStation.addToolPanel(mapLayoutControlsId, {
            title: { n: cartomancer.namespace, t: cartomancer.translationKey.CartoConfig },
            contentComponent: CartoConfigPanel,
            icon: Icons.NounProject.MapLayout,
            placement: 'left'
        });

        return () => {
            toolsStation.removeToolPanel(mapLayoutControlsId);
        };
    }, []);

    return null;
};
