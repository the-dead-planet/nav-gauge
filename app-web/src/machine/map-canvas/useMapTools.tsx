import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import {
    addCompassToolIcon,
    addMapLayoutToolPanel,
    addZoomToolIcons,
    updateCompassIcon,
    updateCurrentZoomIcon,
    useMachineWard,
} from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { CartoConfigPanel } from "../controls/CartoConfigPanel";

export const useMapTools = (map: maplibregl.Map) => {
    const { cartomancer, toolsStation } = useMachineWard<maplibregl.Map>();
    const [isInitialised] = useSubjectState(cartomancer.isInitialised$);
    const [gaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const clickedZoom = useRef(map.getZoom());

    useEffect(() => {
        if (!isInitialised) {
            return;
        }

        const removeCompassToolIcon = addCompassToolIcon(
            gaugeControls,
            toolsStation,
            cartomancer,
            async () => {
                const { lng, lat } = map.getCenter();

                return {
                    center: [lng, lat],
                    bearing: map.getBearing(),
                    pitch: map.getPitch(),
                };
            },
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
            removeCompassToolIcon();
        };
    }, [map, isInitialised, gaugeControls.showCompass]);

    useEffect(() => {
        if (!isInitialised) {
            return;
        }
        const removeZoomToolIcons = addZoomToolIcons(
            gaugeControls,
            toolsStation,
            cartomancer,
            clickedZoom,
            async () => {
                const { lng, lat } = map.getCenter();

                return {
                    center: [lng, lat],
                    zoom: map.getZoom(),
                };
            },
            (options) => map.easeTo(options),
        );
        const zoomEndHandler = () => {
            updateCurrentZoomIcon(toolsStation, clickedZoom, async () => map.getZoom());
        };

        map.on("zoomend", zoomEndHandler);

        return () => {
            map.off("zoomend", zoomEndHandler);
            removeZoomToolIcons();
        };
    }, [map, isInitialised, gaugeControls.showZoomButtons]);

    useEffect(() => {
        const removeMapLayoutToolPanel = addMapLayoutToolPanel(CartoConfigPanel, toolsStation, cartomancer);

        return () => {
            removeMapLayoutToolPanel();
        };
    }, []);

    return null;
};
