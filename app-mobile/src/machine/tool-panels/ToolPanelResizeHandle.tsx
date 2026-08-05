import { FC, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { ResizeHandle } from "@mobile-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import type { ToolPanelPlacement } from "@apparatus";
import { useMachineWard } from "@apparatus";
import { useTheme } from "@ui";
import {
    LEFT_ICONS_WIDTH,
    MIN_REMAINING_MAIN_AREA,
    PANEL_MIN,
    RIGHT_ICONS_WIDTH,
    TOP_TOOLS_MIN,
} from "./tool-panel-size";

type ResizeHandlePlacement = ToolPanelPlacement | "bottom-secondary";

interface DragState {
    startX: number;
    currentX: number;
    startWidth: number;
    panelMin: number;
    hasLeftIcons: boolean;
    hasRightIcons: boolean;
    hasLeftPanels: boolean;
    hasRightPanels: boolean;
}

interface BottomSecondaryDragState {
    startY: number;
    currentY: number;
    startHeight: number;
    panelMin: number;
}

interface Props {
    placement: ResizeHandlePlacement;
    onDraggingChange?: (isDragging: boolean) => void;
}

export const ToolPanelResizeHandle: FC<Props> = ({
    placement,
    onDraggingChange,
}) => {
    const { toolsStation } = useMachineWard();
    const theme = useTheme();
    const [activeLeftToolId] = useSubjectState(toolsStation.activeLeftPanelToolId$);
    const [activeRightToolId] = useSubjectState(toolsStation.activeRightPanelToolId$);

    const toolIcons = useObservableState(toolsStation.toolIconsByPlacement$, []);
    const toolIconsByPlacement = toolsStation.getToolIconsByPlacement(toolIcons);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);

    const isLeft = placement === 'left';
    const isBottomSecondary = placement === 'bottom-secondary';
    const dragStateRef = useRef<DragState | null>(null);
    const bottomSecondaryDragStateRef = useRef<BottomSecondaryDragState | null>(null);

    const handleVerticalDragStart = (clientY: number) => {
        onDraggingChange?.(true);
        const activeBottomSecondaryId = toolsStation.activeBottomSecondaryPanelToolId$.value;
        const isCollapsed = activeBottomSecondaryId === null;
        const storedHeight = isCollapsed ? PANEL_MIN.bottomSecondary : toolsStation.panelWidths$.value.bottomSecondaryHeight;
        const heightClampMin = PANEL_MIN.bottomSecondary;
        const heightClampMax = theme.media$.value.windowHeight - MIN_REMAINING_MAIN_AREA.height;
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
        const newHeight = Math.max(Math.min(ds.startHeight - totalDelta, theme.media$.value.windowHeight - MIN_REMAINING_MAIN_AREA.height - toolsStation.getReservedToolbarHeight()), ds.panelMin);

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

    if (isBottomSecondary) {
        return (
            <View style={[styles.resizeHandleContainer, styles.resizeHandleBottomSecondary]}>
                <ResizeHandle
                    direction="vertical"
                    onDrag={handleVerticalDrag}
                    onDragStart={handleVerticalDragStart}
                    onDragEnd={handleVerticalDragEnd}
                />
            </View>
        );
    }

    const hasToolPanels = toolPanelsByPlacement[placement].length > 0;

    if (!hasToolPanels) {
        return null;
    }

    const handleDragStart = (clientX: number) => {
        onDraggingChange?.(true);
        dragStateRef.current = {
            startX: clientX,
            currentX: clientX,
            startWidth: isLeft
                ? (activeLeftToolId === null ? PANEL_MIN.left : toolsStation.panelWidths$.value.leftWidth)
                : (activeRightToolId === null ? PANEL_MIN.right : toolsStation.panelWidths$.value.rightWidth),
            panelMin: isLeft ? PANEL_MIN.left : PANEL_MIN.right,
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
            ? (otherHasPanels ? (otherCollapsed ? PANEL_MIN.right : otherWidth) : 0)
            : (otherHasPanels ? (otherCollapsed ? PANEL_MIN.left : otherWidth) : 0);

        const iconsReserved = (ds.hasLeftIcons ? LEFT_ICONS_WIDTH : 0)
            + (ds.hasRightIcons ? RIGHT_ICONS_WIDTH : 0);

        const maxWidth = theme.media$.value.windowWidth
            - otherMin
            - iconsReserved
            - Math.max(TOP_TOOLS_MIN, MIN_REMAINING_MAIN_AREA.width);

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

    return (
        <View style={[styles.resizeHandleContainer, isLeft ? styles.resizeHandleLeft : styles.resizeHandleRight]}>
            <ResizeHandle
                direction="horizontal"
                onDrag={handleDrag}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    resizeHandleContainer: {
        position: 'absolute',
        zIndex: 100,
    },
    resizeHandleLeft: {
        right: -4,
        top: 0,
        bottom: 0,
    },
    resizeHandleRight: {
        left: -4,
        top: 0,
        bottom: 0,
    },
    resizeHandleBottomSecondary: {
        top: -4,
        left: 0,
        right: 0,
        height: 8,
    },
});
