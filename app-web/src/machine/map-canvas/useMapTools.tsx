import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { Icons } from "@ui";
import {
    addCompassToolIcon,
    currentZoomIconId,
    mapLayoutControlsId,
    removeCompassToolIcon,
    updateCompassIcon,
    updateCurrentZoomIcon,
    useMachineWard,
    zoomInIconId,
    zoomOutIconId,
} from "@apparatus";
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
        addCompassToolIcon(
            toolsStation,
            cartomancer,
            { bearing: map.getBearing(), pitch: map.getPitch() },
            (options) => map.easeTo(options),
        );

        const rotateHandler = () => {
            updateCompassIcon(toolsStation, { bearing: map.getBearing(), pitch: map.getPitch() })
        };

        map.on('rotate', rotateHandler);
        map.on('pitch', rotateHandler);

        return () => {
            map.off('rotate', rotateHandler);
            map.off('pitch', rotateHandler);
            removeCompassToolIcon(toolsStation);
        };
    }, [gaugeControls.showCompass]);

    useEffect(() => {
        if (!gaugeControls.showZoomButtons) {
            return;
        }
        toolsStation.addToolIcon(zoomInIconId, {
            icon: Icons.NounProject.Plus,
            onClick: (map) => {
                clickedZoom.current = Math.max(clickedZoom.current + 1, Math.floor(map.getZoom() + 1));
                map.easeTo({ zoom: clickedZoom.current });
            },
            placement: 'right',
            tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.ZoomIn },
        });

        toolsStation.addToolIcon(currentZoomIconId, {
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

        toolsStation.addToolIcon(zoomOutIconId, {
            icon: Icons.NounProject.Minus,
            onClick: (map) => {
                clickedZoom.current = Math.min(clickedZoom.current - 1, Math.ceil(map.getZoom() - 1));
                map.easeTo({ zoom: clickedZoom.current });
            },
            placement: 'right',
            tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.ZoomOut },
        });

        const zoomEndHandler = () => {
            updateCurrentZoomIcon(toolsStation, clickedZoom, async () => map.getZoom());
        };

        map.on("zoomend", zoomEndHandler);

        return () => {
            map.off("zoomend", zoomEndHandler);
            toolsStation.removeToolIcon(zoomInIconId);
            toolsStation.removeToolIcon(currentZoomIconId);
            toolsStation.removeToolIcon(zoomOutIconId);
        };
    }, [gaugeControls.showZoomButtons]);

    useEffect(() => {
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
