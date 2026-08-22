import { useEffect, useRef } from "react";
import { addCompassToolIcon, addMapLayoutToolPanel, addZoomToolIcons, useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-apparatus";
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

        const removeCompassToolIcon = addCompassToolIcon(
            gaugeControls,
            toolsStation,
            cartomancer,
            m.getViewState,
            map.camera$.value?.easeTo,
        );

        return () => {
            removeCompassToolIcon();
        };
    }, [map, isInitialised, gaugeControls.showCompass]);

    useEffect(() => {
        const m = map.map$.value;
        if (!isInitialised || !m) {
            return;
        }

        const removeZoomToolIcons = addZoomToolIcons(
            gaugeControls,
            toolsStation,
            cartomancer,
            clickedZoom,
            m.getViewState,
            map.camera$.value?.easeTo,
        );

        return () => {
            removeZoomToolIcons();
        };
    }, [map, isInitialised, gaugeControls.showZoomButtons]);

    useEffect(() => {
        const removeMapLayoutToolPanel = addMapLayoutToolPanel(CartoConfigPanel, toolsStation, cartomancer);

        return () => {
            removeMapLayoutToolPanel();
        };
    }, []);
};
