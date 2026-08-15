import { useTheme } from "@ui";
import { useMachineWard } from "../../useMachineWard";
import { useObservableState, useSubjectState } from "@tinker-chest";
import {
    calculateExpandToDefault,
    LAYOUT_DEFAULTS,
    LAYOUT_MINS,
} from "../tinkers";
import { useMultipleTranslations } from "../../translatron";

export const useSideToolPanel = (
    placement: "left" | "right",
    activeId: string | null,
    onActiveIdChange: (activeId: string | null) => void,
) => {
    const { toolsStation, namespace, translationKey } = useMachineWard();
    const theme = useTheme();
    const [panelWidths, setPanelWidths] = useSubjectState(toolsStation.panelWidths$);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const toolIcons = useObservableState(toolsStation.toolIconsByPlacement$, []);
    const toolIconsByPlacement = toolsStation.getToolIconsByPlacement(toolIcons);
    const effectivePanels = toolPanelsByPlacement[placement];
    const toolPanel = effectivePanels.find(({ id }) => id === activeId);
    const targetPlacement = toolPanel?.placement === 'right' ? 'left' : 'right';
    const show = effectivePanels.length > 0;
    const isCollapsed = activeId === null;
    const isLeft = placement === 'left';
    const panelMin = isLeft ? LAYOUT_MINS.panels.left : LAYOUT_MINS.panels.right;
    const currentWidth = !show ? 0 : isCollapsed ? panelMin : (isLeft ? panelWidths.leftWidth : panelWidths.rightWidth);

    const handleSidePanelActiveIdChange = (newId: string | null) => {
        onActiveIdChange(newId);

        if (newId !== null) {
            const otherCollapsed = isLeft
                ? toolsStation.activeRightPanelToolId$.value === null
                : toolsStation.activeLeftPanelToolId$.value === null;
            const otherHasPanels = isLeft
                ? toolPanelsByPlacement.right.length > 0
                : toolPanelsByPlacement.left.length > 0;
            const otherWidth = otherCollapsed
                ? (isLeft ? LAYOUT_MINS.panels.right : LAYOUT_MINS.panels.left)
                : (otherHasPanels ? (isLeft ? panelWidths.rightWidth : panelWidths.leftWidth) : 0);
            const thisMin = isLeft ? LAYOUT_MINS.panels.left : LAYOUT_MINS.panels.right;
            const thisStoredWidth = isLeft ? panelWidths.leftWidth : panelWidths.rightWidth;
            const iconsReserved = (toolIconsByPlacement.left.length > 0 ? LAYOUT_DEFAULTS.icons.left : 0) + (toolIconsByPlacement.right.length > 0 ? LAYOUT_DEFAULTS.icons.right : 0);
            const column3Min = Math.max(LAYOUT_MINS.tools.top, LAYOUT_MINS.remainingArea.width);
            const maxAvailable = theme.media$.value.windowWidth - otherWidth - iconsReserved - column3Min;
            const clampedWidth = Math.min(Math.max(thisStoredWidth, thisMin), maxAvailable);
            const targetWidth = clampedWidth < thisMin * 2 ? LAYOUT_DEFAULTS.panels[placement] : clampedWidth;

            setPanelWidths((prev) => calculateExpandToDefault(
                targetWidth,
                otherWidth,
                thisMin,
                theme.media$.value.windowWidth,
                toolIconsByPlacement.left.length > 0,
                toolIconsByPlacement.right.length > 0,
                isLeft,
                prev,
            ));
        }
    };

    const [
        panelMenuLabel,
        swapPlacementLabel,
    ] = useMultipleTranslations([
        { n: namespace, t: translationKey.PanelMenu },
        { n: namespace, t: translationKey.SwapPlacement, p: { placement: targetPlacement } },
    ]);

    return {
        panelMenuLabel,
        swapPlacementLabel,
        show,
        toolPanel,
        currentWidth,
        handleSidePanelActiveIdChange,
    };
};
