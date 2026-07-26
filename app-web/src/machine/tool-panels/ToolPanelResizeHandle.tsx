import { FC, useRef } from "react";
import classNames from "classnames";
import { ResizeHandle } from "@web-ui";
import { useObservableState } from "@tinker-chest";
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

interface TriggerProps {
    placement: ToolPanelPlacement;
    onDrag: (delta: number) => void;
    onDragStart: (clientX: number) => void;
    onDragEnd: () => void;
}

const ToolPanelResizeHandleTrigger: FC<TriggerProps> = ({
    placement,
    onDrag,
    onDragStart,
    onDragEnd,
}) => (
    <div className={classNames(styles['resize-handle'], styles[`resize-handle--${placement}`])}>
        <ResizeHandle
            direction="horizontal"
            onDrag={onDrag}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        />
    </div>
);

export const ToolPanelResizeHandle: FC<Props> = ({ placement, onDraggingChange }) => {
    const { toolsStation } = useMachineWard();
    const theme = useTheme();

    const isLeft = placement === 'left';
    const panelMin = isLeft ? PANEL_MIN_LEFT : PANEL_MIN;

    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const toolIcons = useObservableState(toolsStation.toolIconsByPlacement$, []);
    const toolIconsByPlacement = toolsStation.getToolIconsByPlacement(toolIcons);

    const leftIconsPresent = toolIconsByPlacement.left.length > 0;
    const rightIconsPresent = toolIconsByPlacement.right.length > 0;
    const hasToolPanels = toolPanelsByPlacement[placement].length > 0;

    const startClientXRef = useRef(0);
    const startWidthRef = useRef(0);
    const accumulatedDeltaRef = useRef(0);
    const handleDragRef = useRef((_delta: number) => {});
    const handleDragStartRef = useRef((_clientX: number) => {});
    const handleDragEndRef = useRef(() => {});
    const onDraggingChangeRef = useRef<((v: boolean) => void) | undefined>(undefined);

    if (!hasToolPanels) {
        return null;
    }

    const handleDragStart = (clientX: number) => {
        onDraggingChangeRef.current?.(true);
        accumulatedDeltaRef.current = 0;
        startClientXRef.current = clientX;
        const isCollapsed = (isLeft ? toolsStation.activeLeftPanelToolId$.value : toolsStation.activeRightPanelToolId$.value) === null;
        startWidthRef.current = isCollapsed
            ? panelMin
            : (isLeft ? toolsStation.panelWidths$.value.leftWidth : toolsStation.panelWidths$.value.rightWidth);
    };

    const handleDrag = (delta: number) => {
        accumulatedDeltaRef.current += delta;

        const currentClientX = startClientXRef.current + accumulatedDeltaRef.current;
        const leftEdge = startClientXRef.current - startWidthRef.current;
        const widthFromCursor = isLeft
            ? currentClientX - leftEdge
            : leftEdge - currentClientX;

        const activeLeftPanelToolId = toolsStation.activeLeftPanelToolId$.value;
        const activeRightPanelToolId = toolsStation.activeRightPanelToolId$.value;
        const windowWidth = theme.media$.value.windowWidth;

        const iconsReserved = (leftIconsPresent ? LEFT_ICONS_WIDTH : 0) + (rightIconsPresent ? RIGHT_ICONS_WIDTH : 0);
        const otherHasToolPanels = !isLeft ? toolPanelsByPlacement.left.length > 0 : toolPanelsByPlacement.right.length > 0;
        const otherCollapsed = !isLeft ? activeLeftPanelToolId === null : activeRightPanelToolId === null;
        const otherStoredWidth = !isLeft ? toolsStation.panelWidths$.value.leftWidth : toolsStation.panelWidths$.value.rightWidth;
        const otherMin = !isLeft ? PANEL_MIN_LEFT : PANEL_MIN;
        const otherEffective = !otherHasToolPanels ? 0 : otherCollapsed ? otherMin : otherStoredWidth;
        const column3Min = Math.max(TOP_TOOLS_MIN, MAP_MIN);
        const maxWidth = windowWidth - otherEffective - iconsReserved - column3Min;

        const clampedWidth = Math.max(Math.min(widthFromCursor, maxWidth), panelMin);
        const currentStored = isLeft ? toolsStation.panelWidths$.value.leftWidth : toolsStation.panelWidths$.value.rightWidth;

        if (clampedWidth !== currentStored) {
            toolsStation.panelWidths$.next({
                ...toolsStation.panelWidths$.value,
                [isLeft ? 'leftWidth' : 'rightWidth']: clampedWidth,
            });
        }

        const effectivePanels = toolPanelsByPlacement[placement];
        const isCollapsed = (isLeft ? activeLeftPanelToolId : activeRightPanelToolId) === null;
        const activeId$ = isLeft ? toolsStation.activeLeftPanelToolId$ : toolsStation.activeRightPanelToolId$;

        if (isCollapsed && clampedWidth > panelMin && effectivePanels.length > 0) {
            activeId$.next(effectivePanels[0].id);
        } else if (!isCollapsed && clampedWidth === panelMin) {
            activeId$.next(null);
        }
    };

    const handleDragEnd = () => {
        onDraggingChangeRef.current?.(false);
    };

    handleDragRef.current = handleDrag;
    handleDragStartRef.current = handleDragStart;
    handleDragEndRef.current = handleDragEnd;
    onDraggingChangeRef.current = onDraggingChange;

    const stableOnDrag = (delta: number) => handleDragRef.current(delta);
    const stableOnDragStart = (clientX: number) => handleDragStartRef.current(clientX);
    const stableOnDragEnd = () => handleDragEndRef.current();

    return (
        <ToolPanelResizeHandleTrigger
            placement={placement}
            onDrag={stableOnDrag}
            onDragStart={stableOnDragStart}
            onDragEnd={stableOnDragEnd}
        />
    );
};
