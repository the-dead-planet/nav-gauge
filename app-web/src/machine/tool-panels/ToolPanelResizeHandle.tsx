import { FC, useRef } from "react";
import classNames from "classnames";
import { ResizeHandle } from "@web-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import type { ToolPanelPlacement } from "@apparatus";

type ResizeHandlePlacement = ToolPanelPlacement | "bottom-secondary";
import { useMachineWard } from "@apparatus";
import { useTheme } from "@ui";
import {
    BOTTOM_SECONDARY_PANEL_MIN,
    LEFT_ICONS_WIDTH,
    MAP_MIN,
    PANEL_MIN,
    PANEL_MIN_LEFT,
    RIGHT_ICONS_WIDTH,
    TOP_TOOLS_MIN,
} from "./tool-panel-size";
import styles from '../machine.module.css';

interface Props {
    placement: ResizeHandlePlacement;
    onDraggingChange?: (isDragging: boolean) => void;
}

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
        const storedHeight = isCollapsed ? BOTTOM_SECONDARY_PANEL_MIN : toolsStation.panelWidths$.value.bottomSecondaryHeight;
        const heightClampMin = BOTTOM_SECONDARY_PANEL_MIN;
        const heightClampMax = theme.media$.value.windowHeight - 100;
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
        const newHeight = Math.max(Math.min(ds.startHeight - totalDelta, theme.media$.value.windowHeight - 100 - 50 - 40 - 70), ds.panelMin);

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
            <div className={classNames(styles['resize-handle'], styles['resize-handle--bottom-secondary'])}>
                <ResizeHandle
                    direction="vertical"
                    onDrag={handleVerticalDrag}
                    onDragStart={handleVerticalDragStart}
                    onDragEnd={handleVerticalDragEnd}
                />
            </div>
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
                ? (activeLeftToolId === null ? PANEL_MIN_LEFT : toolsStation.panelWidths$.value.leftWidth)
                : (activeRightToolId === null ? PANEL_MIN : toolsStation.panelWidths$.value.rightWidth),
            panelMin: isLeft ? PANEL_MIN_LEFT : PANEL_MIN,
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
            ? (otherHasPanels ? (otherCollapsed ? PANEL_MIN : otherWidth) : 0)
            : (otherHasPanels ? (otherCollapsed ? PANEL_MIN_LEFT : otherWidth) : 0);

        const iconsReserved = (ds.hasLeftIcons ? LEFT_ICONS_WIDTH : 0)
            + (ds.hasRightIcons ? RIGHT_ICONS_WIDTH : 0);

        const maxWidth = theme.media$.value.windowWidth
            - otherMin
            - iconsReserved
            - Math.max(TOP_TOOLS_MIN, MAP_MIN);

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
        <div className={classNames(styles['resize-handle'], styles[`resize-handle--${placement}`])}>
            <ResizeHandle
                direction="horizontal"
                onDrag={handleDrag}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            />
        </div>
    );
};
