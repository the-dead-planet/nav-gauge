import { useTheme } from "@ui";
import { useMachineWard } from "../../useMachineWard";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { DEFAULT_BOTTOM_SECONDARY_HEIGHT, MIN_REMAINING_MAIN_AREA, PANEL_MIN } from "../tinkers";

export const useSecondaryBottomToolPanel = (
    activeId: string | null,
    onActiveIdChange: (activeId: string | null) => void,
) => {
    const { toolsStation } = useMachineWard();
    const theme = useTheme();
    const [panelWidths, setPanelWidths] = useSubjectState(toolsStation.panelWidths$);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = toolPanelsByPlacement["left"].concat(toolPanelsByPlacement["right"]);
    const toolPanel = effectivePanels.find(({ id }) => id === activeId);
    const show = effectivePanels.length > 0;
    const isCollapsed = activeId === null;

    const effectiveHeight = !show
        ? 0
        : isCollapsed
            ? PANEL_MIN.bottomSecondary
            : panelWidths.bottomSecondaryHeight;

    const handleToolSelect = (newId: string | null) => {
        onActiveIdChange(newId);

        if (newId !== null) {
            const thisMin = PANEL_MIN.bottomSecondary;
            const maxAvailable = theme.media$.value.windowHeight - MIN_REMAINING_MAIN_AREA.height;
            const clampedHeight = Math.min(Math.max(panelWidths.bottomSecondaryHeight, thisMin), maxAvailable);
            const targetHeight = clampedHeight === thisMin ? DEFAULT_BOTTOM_SECONDARY_HEIGHT : clampedHeight;

            setPanelWidths((prev) => ({
                ...prev,
                bottomSecondaryHeight: targetHeight,
            }));
        }
    };

    return {
        show,
        isCollapsed,
        effectiveHeight,
        toolPanel,
        handleToolSelect,
    };
};
