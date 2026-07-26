import { useEffect } from "react";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { useMachineWard } from "@apparatus";
import { useTheme } from "@ui";
import type { PanelState } from "./tool-panel-size";
import { clampPanelLayout } from "./tool-panel-size";

export const useToolPanelSizeClamp = () => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const windowWidth = media.windowWidth;
    const { toolsStation } = useMachineWard();

    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const leftHasToolPanels = toolPanelsByPlacement.left.length > 0;
    const rightHasToolPanels = toolPanelsByPlacement.right.length > 0;

    const toolIcons = useObservableState(toolsStation.toolIconsByPlacement$, []);
    const toolIconsByPlacement = toolsStation.getToolIconsByPlacement(toolIcons);
    const leftIconsPresent = toolIconsByPlacement.left.length > 0;
    const rightIconsPresent = toolIconsByPlacement.right.length > 0;

    const leftActiveId = useObservableState(toolsStation.activeLeftPanelToolId$, null);
    const rightActiveId = useObservableState(toolsStation.activeRightPanelToolId$, null);

    useEffect(() => {
        console.log({windowWidth})
        const leftState: PanelState = {
            hasToolPanels: leftHasToolPanels,
            isCollapsed: leftActiveId === null,
            storedWidth: toolsStation.panelWidths$.value.leftWidth,
        };
        const rightState: PanelState = {
            hasToolPanels: rightHasToolPanels,
            isCollapsed: rightActiveId === null,
            storedWidth: toolsStation.panelWidths$.value.rightWidth,
        };
        const prev = toolsStation.panelWidths$.value;
        const next = clampPanelLayout(prev, leftState, rightState, windowWidth, leftIconsPresent, rightIconsPresent);

        if (next !== prev) {
            toolsStation.panelWidths$.next(next);
        }
    }, [windowWidth, leftIconsPresent, rightIconsPresent, leftHasToolPanels, rightHasToolPanels, leftActiveId, rightActiveId]);
};
