import { FC, useState } from "react";
import classNames from "classnames";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { MIN_REMAINING_MAIN_AREA, useMachineWard } from "@apparatus";
import { useTheme } from "@ui";
import { PANEL_MIN, DEFAULT_BOTTOM_SECONDARY_HEIGHT } from "../../tool-panel-size";
import { ToolPanelResizeHandle } from "../../ToolPanelResizeHandle";
import { ToolPanelHeader } from "../../ToolPanelHeader";
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
    const theme = useTheme();
    const [panelWidths, setPanelWidths] = useSubjectState(toolsStation.panelWidths$);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = toolPanelsByPlacement["left"].concat(toolPanelsByPlacement["right"]);
    const toolPanel = effectivePanels.find(({ id }) => id === activeId);
    const showHeader = effectivePanels.length > 0;
    const isCollapsed = activeId === null;
    const [isDragging, setIsDragging] = useState(false);

    const effectiveHeight = !showHeader
        ? 0
        : isCollapsed
            ? PANEL_MIN.bottomSecondary
            : panelWidths.bottomSecondaryHeight;

    const handleToolSelect = (newId: string | null) => {
        onActiveIdChange(newId);

        if (newId !== null) {
            const thisMin = PANEL_MIN.bottomSecondary;
            const maxAvailable = theme.media$.value.windowHeight - MIN_REMAINING_MAIN_AREA.height;
            const clampedHeight = Math.min(Math.max(panelWidths.bottomSecondaryHeight, thisMin), maxAvailable);
            const targetHeight = clampedHeight === thisMin ? DEFAULT_BOTTOM_SECONDARY_HEIGHT : clampedHeight;

            setPanelWidths((prev) => ({
                ...prev,
                bottomSecondaryHeight: targetHeight,
            }));
        }
    };

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
            <ToolPanelResizeHandle
                placement="bottom-secondary"
                onDraggingChange={setIsDragging}
            />
        </div>
    );
};
