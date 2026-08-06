import { useEffect } from "react";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { useTheme } from "@ui";
import type { PanelState } from "../../../../../../app-mobile/src/machine/tool-panels/tool-panel-size";
import { clampPanelLayout } from "../../../../../../app-mobile/src/machine/tool-panels/tool-panel-size";
import { useMachineWard } from "../../useMachineWard";

export const useToolPanelSizeClamp = () => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
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
    const bottomSecondaryActiveId = useObservableState(toolsStation.activeBottomSecondaryPanelToolId$, null);

    useEffect(() => {
        const leftState: PanelState = {
            hasToolPanels: leftHasToolPanels,
            isCollapsed: leftActiveId === null,
            storedSize: toolsStation.panelWidths$.value.leftWidth,
        };
        const rightState: PanelState = {
            hasToolPanels: rightHasToolPanels,
            isCollapsed: rightActiveId === null,
            storedSize: toolsStation.panelWidths$.value.rightWidth,
        };
        const bottomSecondaryState: PanelState = {
            hasToolPanels: leftHasToolPanels || rightHasToolPanels,
            isCollapsed: bottomSecondaryActiveId === null,
            storedSize: toolsStation.panelWidths$.value.bottomSecondaryHeight,
        };
        const prev = toolsStation.panelWidths$.value;
        const next = clampPanelLayout(prev, leftState, rightState, bottomSecondaryState, { width: media.windowWidth, height: media.windowHeight }, leftIconsPresent, rightIconsPresent, toolsStation.getReservedToolbarHeight());

        if (next !== prev) {
            toolsStation.panelWidths$.next(next);
        }
    }, [
        media.windowHeight,
        media.windowHeight,
        leftIconsPresent,
        rightIconsPresent,
        leftHasToolPanels,
        rightHasToolPanels,
        leftActiveId,
        rightActiveId,
        bottomSecondaryActiveId,
    ]);

    const groupSidePanelsInBottomSecondaryToolbar = media.isLessThanSm;

    return {
        groupSidePanelsInBottomSecondaryToolbar
    };
};
