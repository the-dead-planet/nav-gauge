import type * as maplibregl from "maplibre-gl";
import { FC, useState } from "react";
import classNames from "classnames";
import { useMachineWard, useSecondaryBottomToolPanel } from "@apparatus";
import { BottomSecondaryToolPanelResizeHandle } from "./SecondaryBottomToolPanelResizeHandle";
import { ToolPanelHeader } from "../../panel-header/ToolPanelHeader";
import styles from '../../../machine.module.css';

interface Props {
    map?: maplibregl.Map;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
}

export const SecondaryBottomToolPanel: FC<Props> = ({
    map,
    activeId,
    onActiveIdChange,
}) => {
    const { toolsStation } = useMachineWard();
    const [isDragging, setIsDragging] = useState(false);

    const {
        show: showHeader,
        isCollapsed,
        effectiveHeight,
        toolPanel,
        handleToolSelect,
    } = useSecondaryBottomToolPanel(activeId, onActiveIdChange);

    return (
        <div
            ref={(instance) => {
                toolsStation.bottomSecondaryToolPanelSizeRef.current = instance;
            }}
            className={styles['secondary-bottom-toolbar']}
        >
            <div
                className={classNames(
                    styles['toolbar'],
                    styles['bottom-secondary'],
                    { [styles['dragging']]: isDragging },
                    { [styles['collapsed']]: isCollapsed },
                    { [styles['expanded']]: !isCollapsed },
                )}
                style={{ height: effectiveHeight }}
            >
                <div className={classNames(styles['content'], { [styles['with-header']]: showHeader })}>
                    {showHeader && (
                        <ToolPanelHeader
                            placement="bottom"
                            activeId={activeId}
                            onActiveIdChange={handleToolSelect}
                            headerControls={toolPanel?.headerComponent ? (
                                <toolPanel.headerComponent map={map} placement={toolPanel.placement} />
                            ) : undefined}
                        />
                    )}
                    {toolPanel ? (
                        <div className={styles['component']}>
                            <div className={styles['component-content']}>
                                <toolPanel.contentComponent map={map} placement={toolPanel.placement} />
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            <BottomSecondaryToolPanelResizeHandle onDraggingChange={setIsDragging} />
        </div>
    );
};
