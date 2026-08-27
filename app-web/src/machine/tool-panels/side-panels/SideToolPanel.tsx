import type * as maplibregl from "maplibre-gl";
import { FC, useState } from "react";
import classNames from "classnames";
import { Menu, MenuItem } from "@web-ui";
import { assignSideToolPanelRef, swapSideToolPanelPlacement, useSideToolPanel } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { ToolPanelHeader } from "../panel-header/ToolPanelHeader";
import { SideToolPanelResizeHandle } from "./SideToolPanelResizeHandle";
import styles from '../../machine.module.css';

interface Props {
    placement: "left" | "right";
    map?: maplibregl.Map;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
}

export const SideToolPanel: FC<Props> = ({
    placement,
    map,
    activeId,
    onActiveIdChange,
}) => {
    const { toolsStation } = useWebMachineWard();
    const [isDragging, setIsDragging] = useState(false);

    const {
        panelMenuLabel,
        swapPlacementLabel,
        show,
        toolPanel,
        currentWidth,
        handleSidePanelActiveIdChange,
    } = useSideToolPanel(placement, activeId, onActiveIdChange);

    return (
        <div
            ref={assignSideToolPanelRef(placement, toolsStation)}
            className={classNames(
                styles['toolbar'],
                styles[placement],
                { [styles['dragging']]: isDragging },
            )}
            style={{ width: currentWidth }}
        >
            {show ? (
                <>
                    <div className={styles['content']}>
                        <ToolPanelHeader
                            placement={placement}
                            activeId={activeId}
                            onActiveIdChange={handleSidePanelActiveIdChange}
                        />
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
                                                    onClick={swapSideToolPanelPlacement(toolPanel, toolsStation)}
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
                    </div>
                    <SideToolPanelResizeHandle placement={placement} onDraggingChange={setIsDragging} />
                </>
            ) : null}
        </div>
    );
};
