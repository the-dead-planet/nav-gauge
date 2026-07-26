import { FC, useState } from "react";
import classNames from "classnames";
import { Menu, MenuItem } from "@web-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { ToolPanelPlacement, useMachineWard, useMultipleTranslations } from "@apparatus";
import { useTheme } from "@ui";
import { SideToolPanelHeader } from "./SideToolPanelHeader";
import { BottomToolPanelHeader } from "./bottom/BottomToolPanelPanelHeader";
import { DEFAULT_WIDTH, PANEL_MIN, PANEL_MIN_LEFT, calculateExpandToDefault, LEFT_ICONS_WIDTH, RIGHT_ICONS_WIDTH, TOP_TOOLS_MIN, MAP_MIN } from "./tool-panel-size";
import { ToolPanelResizeHandle } from "./ToolPanelResizeHandle";
import styles from '../machine.module.css';

interface Props {
    placement: ToolPanelPlacement;
    map?: maplibregl.Map;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
}

export const ToolPanel: FC<Props> = ({
    placement,
    map,
    activeId,
    onActiveIdChange,
}) => {
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
    const showHeader = effectivePanels.length > 0;
    const isCollapsed = activeId === null;
    const isLeft = placement === 'left';
    const panelMin = isLeft ? PANEL_MIN_LEFT : PANEL_MIN;
    const currentWidth = !showHeader ? 0 : isCollapsed ? panelMin : (isLeft ? panelWidths.leftWidth : panelWidths.rightWidth);

    const [isDragging, setIsDragging] = useState(false);

    const handleActiveIdChange = (newId: string | null) => {
        onActiveIdChange(newId);
        if (newId !== null) {
            const otherCollapsed = isLeft
                ? toolsStation.activeRightPanelToolId$.value === null
                : toolsStation.activeLeftPanelToolId$.value === null;
            const otherHasPanels = isLeft
                ? toolPanelsByPlacement.right.length > 0
                : toolPanelsByPlacement.left.length > 0;
            const otherWidth = otherCollapsed
                ? (isLeft ? PANEL_MIN : PANEL_MIN_LEFT)
                : (otherHasPanels ? (isLeft ? panelWidths.rightWidth : panelWidths.leftWidth) : 0);
            const thisMin = isLeft ? PANEL_MIN_LEFT : PANEL_MIN;
            const thisStoredWidth = isLeft ? panelWidths.leftWidth : panelWidths.rightWidth;
            const iconsReserved = (toolIconsByPlacement.left.length > 0 ? LEFT_ICONS_WIDTH : 0) + (toolIconsByPlacement.right.length > 0 ? RIGHT_ICONS_WIDTH : 0);
            const column3Min = Math.max(TOP_TOOLS_MIN, MAP_MIN);
            const maxAvailable = theme.media$.value.windowWidth - otherWidth - iconsReserved - column3Min;
            const clampedWidth = Math.min(Math.max(thisStoredWidth, thisMin), maxAvailable);
            const targetWidth = clampedWidth === thisMin ? DEFAULT_WIDTH : clampedWidth;
            setPanelWidths(() => calculateExpandToDefault(
                targetWidth,
                otherWidth,
                thisMin,
                theme.media$.value.windowWidth,
                toolIconsByPlacement.left.length > 0,
                toolIconsByPlacement.right.length > 0,
                isLeft,
            ));
        }
    };

    const sideHeader = showHeader ? (
        <SideToolPanelHeader
            placement={placement}
            activeId={activeId}
            onActiveIdChange={handleActiveIdChange}
        />
    ) : null;

    const [
        panelMenuLabel,
        swapPlacementLabel,
    ] = useMultipleTranslations([
        { n: namespace, t: translationKey.PanelMenu },
        { n: namespace, t: translationKey.SwapPlacement, p: { placement: targetPlacement } },
    ]);

    if (placement === 'bottom') {
        return (
            <div className={classNames(styles['toolbar'], styles[placement])}>
                {effectivePanels.length > 0 && (
                    <div className={classNames(styles['content'], {
                        [styles['with-header']]: showHeader,
                    })}>
                        <BottomToolPanelHeader placement={placement} activeId={activeId} onActiveIdChange={onActiveIdChange} />
                        {toolPanel ? (
                            <div className={styles['component']}>
                                {toolPanel.headerComponent ? (
                                    <div className={styles['component-header']}>
                                        <toolPanel.headerComponent map={map} placement={toolPanel.placement} />
                                    </div>
                                ) : null}
                                <div className={styles['component-content']}>
                                    <toolPanel.contentComponent map={map} placement={toolPanel.placement} />
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={classNames(
                styles['toolbar'],
                styles[placement],
                { [styles['dragging']]: isDragging },
                { [styles['collapsed']]: isCollapsed },
                { [styles['expanded']]: !isCollapsed },
            )}
            style={{ width: currentWidth }}
        >
            {effectivePanels.length > 0 && (
                <div className={classNames(styles['content'], {
                    [styles['with-header']]: showHeader,
                })}>
                    {placement === 'right' ? sideHeader : null}
                    {toolPanel ? (
                        <div className={styles['component']}>
                            {toolPanel.placement !== 'bottom' || toolPanel?.headerComponent ? (
                                <div className={styles['component-header']}>
                                    {toolPanel.headerComponent ? <toolPanel.headerComponent map={map} placement={toolPanel.placement} /> : null}
                                    {toolPanel.placement !== 'bottom' ? (
                                        <Menu
                                            aria-label={panelMenuLabel}
                                            tooltip={panelMenuLabel}
                                            tooltipPlacement="bottom"
                                            placement={toolPanel.placement === "right" ? "bottom-right" : "bottom-left"}
                                            iconActiveColor="secondary"
                                            iconSize="xs"
                                        >
                                            <MenuItem
                                                key="swap-placement"
                                                isFirst
                                                type="button"
                                                closeOnPress
                                                onClick={() => {
                                                    if (toolPanel.placement === 'right') {
                                                        toolsStation.updateToolPanelPlacement(toolPanel.id, 'left');
                                                        toolsStation.activeLeftPanelToolId$.next(toolPanel.id);
                                                    } else {
                                                        toolsStation.updateToolPanelPlacement(toolPanel.id, 'right');
                                                        toolsStation.activeRightPanelToolId$.next(toolPanel.id);
                                                    }
                                                }}
                                            >
                                                {swapPlacementLabel}
                                            </MenuItem>
                                        </Menu>
                                    ) : null}
                                </div>
                            ) : null}
                            <div className={styles['component-content']}>
                                <toolPanel.contentComponent map={map} placement={toolPanel.placement} />
                            </div>
                        </div>
                    ) : null}
                    {placement === 'left' ? sideHeader : null}
                </div>
            )}
            <ToolPanelResizeHandle placement={placement} onDraggingChange={setIsDragging} />
        </div>
    );
};
