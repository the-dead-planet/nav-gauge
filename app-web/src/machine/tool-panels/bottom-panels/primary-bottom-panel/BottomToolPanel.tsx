import { FC } from "react";
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

    return (
        <div
            ref={assignBottomToolPanelRef(toolsStation)}
            className={classNames(styles['toolbar'], styles["bottom"])}
        >
            {showHeader && (
                <div className={classNames(styles['content'], { [styles['with-header']]: showHeader })}>
                    <BottomToolPanelHeader
                        activeId={activeId}
                        onActiveIdChange={onActiveIdChange}
                        joinHeaderButtons={joinHeaderButtons}
                    />
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
};
