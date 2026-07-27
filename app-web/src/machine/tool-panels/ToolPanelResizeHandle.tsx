import { FC, useRef } from "react";
import classNames from "classnames";
import { ResizeHandle } from "@web-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import type { ToolPanelPlacement } from "@apparatus";
import { useMachineWard } from "@apparatus";
import { useTheme } from "@ui";
import {
    LEFT_ICONS_WIDTH,
    MAP_MIN,
    PANEL_MIN,
    PANEL_MIN_LEFT,
    RIGHT_ICONS_WIDTH,
    TOP_TOOLS_MIN,
} from "./tool-panel-size";
import styles from '../machine.module.css';

interface Props {
    placement: ToolPanelPlacement;
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

export const ToolPanelResizeHandle: FC<Props> = ({ placement, onDraggingChange }) => {
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
