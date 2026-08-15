import { useRef } from "react";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { useTheme } from "@ui";
import { useMachineWard } from "../../useMachineWard";
import { DragState } from "../model";
import { LAYOUT_DEFAULTS, LAYOUT_MINS } from "../tinkers";

export const useSideToolPanelResizeHandle = (
    placement: "left" | "right",
    onDraggingChange: (isDragging: boolean) => void,
) => {
    const { toolsStation } = useMachineWard();
    const theme = useTheme();
    const [activeLeftToolId] = useSubjectState(toolsStation.activeLeftPanelToolId$);
    const [activeRightToolId] = useSubjectState(toolsStation.activeRightPanelToolId$);

    const toolIcons = useObservableState(toolsStation.toolIconsByPlacement$, []);
    const toolIconsByPlacement = toolsStation.getToolIconsByPlacement(toolIcons);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);

    const isLeft = placement === 'left';
    const dragStateRef = useRef<DragState | null>(null);

    const handleDragStart = (clientX: number) => {
        onDraggingChange?.(true);
        dragStateRef.current = {
            startX: clientX,
            currentX: clientX,
            startWidth: isLeft
                ? (activeLeftToolId === null ? LAYOUT_MINS.panels.left : toolsStation.panelWidths$.value.leftWidth)
                : (activeRightToolId === null ? LAYOUT_MINS.panels.right : toolsStation.panelWidths$.value.rightWidth),
            panelMin: isLeft ? LAYOUT_MINS.panels.left : LAYOUT_MINS.panels.right,
            hasLeftIcons: toolIconsByPlacement.left.length > 0,
            hasRightIcons: toolIconsByPlacement.right.length > 0,
            hasLeftPanels: toolPanelsByPlacement.left.length > 0,
            hasRightPanels: toolPanelsByPlacement.right.length > 0,
        };
    };

    const handleDrag = (delta: number) => {
        const ds = dragStateRef.current;
        if (!ds) {
            return;
        }

        ds.currentX += delta;
        const totalDelta = ds.currentX - ds.startX;

        const otherHasPanels = isLeft ? ds.hasRightPanels : ds.hasLeftPanels;
        const otherCollapsed = isLeft ? activeRightToolId === null : activeLeftToolId === null;
        const otherWidth = isLeft
            ? (otherHasPanels && activeRightToolId !== null ? toolsStation.panelWidths$.value.rightWidth : 0)
            : (otherHasPanels && activeLeftToolId !== null ? toolsStation.panelWidths$.value.leftWidth : 0);
        const otherMin = isLeft
            ? (otherHasPanels ? (otherCollapsed ? LAYOUT_MINS.panels.right : otherWidth) : 0)
            : (otherHasPanels ? (otherCollapsed ? LAYOUT_MINS.panels.left : otherWidth) : 0);

        const iconsReserved = (ds.hasLeftIcons ? LAYOUT_DEFAULTS.icons.left : 0)
            + (ds.hasRightIcons ? LAYOUT_DEFAULTS.icons.right : 0);

        const maxWidth = theme.media$.value.windowWidth
            - otherMin
            - iconsReserved
            - Math.max(LAYOUT_MINS.tools.top, LAYOUT_MINS.remainingArea.width);

        const clampedWidth = Math.max(Math.min(ds.startWidth + (isLeft ? totalDelta : -totalDelta), maxWidth), ds.panelMin);

        const currentStored = isLeft
            ? toolsStation.panelWidths$.value.leftWidth
            : toolsStation.panelWidths$.value.rightWidth;

        if (clampedWidth !== currentStored) {
            toolsStation.panelWidths$.next({
                ...toolsStation.panelWidths$.value,
                [isLeft ? 'leftWidth' : 'rightWidth']: clampedWidth,
            });
        }

        const currentActiveId = isLeft ? activeLeftToolId : activeRightToolId;
        const activeIdSubject = isLeft ? toolsStation.activeLeftPanelToolId$ : toolsStation.activeRightPanelToolId$;
        const effectivePanels = toolPanelsByPlacement[placement];

        if (currentActiveId === null && clampedWidth > ds.panelMin && effectivePanels.length > 0) {
            activeIdSubject.next(effectivePanels[0].id);
        } else if (currentActiveId !== null && clampedWidth === ds.panelMin) {
            activeIdSubject.next(null);
        }
    };

    const handleDragEnd = () => {
        dragStateRef.current = null;
        onDraggingChange?.(false);
    };

    return {
        handleDragStart,
        handleDrag,
        handleDragEnd,
    };
};
