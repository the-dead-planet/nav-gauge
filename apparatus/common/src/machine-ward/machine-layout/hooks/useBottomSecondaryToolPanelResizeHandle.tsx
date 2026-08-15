import { useRef } from "react";
import { useObservableState } from "@tinker-chest";
import { useTheme } from "@ui";
import { useMachineWard } from "../../useMachineWard";
import { BottomSecondaryDragState } from "../model";
import { LAYOUT_MINS } from "../tinkers";

export const useBottomSecondaryToolPanelResizeHandle = (
    onDraggingChange?: (isDragging: boolean) => void
) => {
    const { toolsStation } = useMachineWard();
    const theme = useTheme();

    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);

    const bottomSecondaryDragStateRef = useRef<BottomSecondaryDragState | null>(null);

    const handleVerticalDragStart = (clientY: number) => {
        onDraggingChange?.(true);
        const activeBottomSecondaryId = toolsStation.activeBottomSecondaryPanelToolId$.value;
        const isCollapsed = activeBottomSecondaryId === null;
        const storedHeight = isCollapsed ? LAYOUT_MINS.panels.bottomSecondary : toolsStation.panelWidths$.value.bottomSecondaryHeight;
        const heightClampMin = LAYOUT_MINS.panels.bottomSecondary;
        const heightClampMax = theme.media$.value.windowHeight - LAYOUT_MINS.remainingArea.height;
        const clampedStored = Math.min(Math.max(storedHeight, heightClampMin), heightClampMax);
        bottomSecondaryDragStateRef.current = {
            startY: clientY,
            currentY: clientY,
            startHeight: clampedStored,
            panelMin: heightClampMin,
        };
    };

    const handleVerticalDrag = (delta: number) => {
        const ds = bottomSecondaryDragStateRef.current;
        if (!ds) {
            return;
        }

        ds.currentY += delta;
        const totalDelta = ds.currentY - ds.startY;
        const newHeight = Math.max(Math.min(ds.startHeight - totalDelta, theme.media$.value.windowHeight - LAYOUT_MINS.remainingArea.height - toolsStation.getReservedToolbarHeight()), ds.panelMin);

        const activeBottomSecondaryId = toolsStation.activeBottomSecondaryPanelToolId$.value;
        const isCollapsed = activeBottomSecondaryId === null;
        const effectivePanels = toolPanelsByPlacement["left"].concat(toolPanelsByPlacement["right"]);
        const willCollapse = !isCollapsed && newHeight === ds.panelMin;
        const willExpand = isCollapsed && newHeight > ds.panelMin && effectivePanels.length > 0;

        if (!willCollapse) {
            const currentStored = toolsStation.panelWidths$.value.bottomSecondaryHeight;

            if (newHeight !== currentStored) {
                toolsStation.panelWidths$.next({
                    ...toolsStation.panelWidths$.value,
                    bottomSecondaryHeight: newHeight,
                });
            }
        }

        if (willExpand) {
            toolsStation.activeBottomSecondaryPanelToolId$.next(effectivePanels[0].id);
        } else if (willCollapse) {
            toolsStation.panelWidths$.next({
                ...toolsStation.panelWidths$.value,
                bottomSecondaryHeight: ds.startHeight,
            });
            toolsStation.activeBottomSecondaryPanelToolId$.next(null);
        }
    };

    const handleVerticalDragEnd = () => {
        bottomSecondaryDragStateRef.current = null;
        onDraggingChange?.(false);
    };

    return {
        handleVerticalDragStart,
        handleVerticalDrag,
        handleVerticalDragEnd,
    }
};
