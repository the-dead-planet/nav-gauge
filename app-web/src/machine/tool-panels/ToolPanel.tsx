import { FC, useState } from "react";
import classNames from "classnames";
import { Menu, MenuItem } from "@web-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { ToolPanelPlacement, useMachineWard, useMultipleTranslations } from "@apparatus";
import { SideToolPanelHeader } from "./SideToolPanelHeader";
import { BottomToolPanelHeader } from "./bottom/BottomToolPanelPanelHeader";
import { DEFAULT_WIDTH, PANEL_MIN, PANEL_MIN_LEFT } from "./tool-panel-size";
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
    const [panelWidths, setPanelWidths] = useSubjectState(toolsStation.panelWidths$);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
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
            const current = isLeft ? panelWidths.leftWidth : panelWidths.rightWidth;
            if (current <= panelMin) {
                setPanelWidths((prev) => ({
                    ...prev,
                    [isLeft ? 'leftWidth' : 'rightWidth']: DEFAULT_WIDTH,
                }));
            }
        }
    };

    const sideHeader = showHeader ? (
        <SideToolPanelHeader placement={placement} activeId={activeId} onActiveIdChange={handleActiveIdChange} />
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
