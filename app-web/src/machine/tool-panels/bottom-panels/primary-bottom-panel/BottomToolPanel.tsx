import { FC } from "react";
import classNames from "classnames";
import { useObservableState } from "@tinker-chest";
import { useMachineWard } from "@apparatus";
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
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = toolPanelsByPlacement["bottom"];
    const toolPanel = effectivePanels.find(({ id }) => id === activeId);
    const showHeader = effectivePanels.length > 0;

    return (
        <div
            ref={(instance) => {
                toolsStation.bottomToolPanelSizeRef.current = instance;
            }}
            className={classNames(styles['toolbar'], styles["bottom"])}
        >
            {effectivePanels.length > 0 && (
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
