import type * as maplibregl from "maplibre-gl";
import { FC, useEffect, useState } from "react";
import classNames from "classnames";
import { assignBottomToolPanelRef, useBottomToolPanel, useMachineWard } from "@apparatus";
import { BottomToolPanelHeader } from "./BottomToolPanelPanelHeader";
import styles from '../../../machine.module.css';

interface Props {
    map?: maplibregl.Map;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
    joinHeaderButtons?: boolean;
}

export const BottomToolPanel: FC<Props> = ({
    map,
    activeId,
    onActiveIdChange,
    joinHeaderButtons,
}) => {
    const { toolsStation } = useMachineWard();
    const { show: showHeader, toolPanel } = useBottomToolPanel(activeId);
    const [lastVisibleToolPanel, setLastVisibleToolPanel] = useState(toolPanel);

    useEffect(() => {
        if (toolPanel) {
            setLastVisibleToolPanel(toolPanel);
        }
    }, [toolPanel]);

    const visibleToolPanel = toolPanel ?? lastVisibleToolPanel;

    return (
        <div
            ref={assignBottomToolPanelRef(toolsStation)}
            className={classNames(styles['toolbar'], styles["bottom"])}
        >
            <div
                className={classNames(
                    styles['content'],
                    { [styles['with-header']]: showHeader },
                    { [styles['expanded']]: toolPanel !== undefined },
                )}
            >
                {showHeader && (
                    <BottomToolPanelHeader
                        activeId={activeId}
                        onActiveIdChange={onActiveIdChange}
                        joinHeaderButtons={joinHeaderButtons}
                    />
                )}
                {visibleToolPanel ? (
                    <div className={styles['component']}>
                        {visibleToolPanel.headerComponent ? (
                            <div className={styles['component-header']}>
                                <visibleToolPanel.headerComponent map={map} placement={visibleToolPanel.placement} />
                            </div>
                        ) : null}
                        <div className={styles['component-content']}>
                            <visibleToolPanel.contentComponent map={map} placement={visibleToolPanel.placement} />
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
