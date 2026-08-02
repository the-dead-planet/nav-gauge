import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { useMachineWard } from "@apparatus";
import { useTheme } from "@ui";
import { BOTTOM_SECONDARY_PANEL_MIN, DEFAULT_BOTTOM_SECONDARY_HEIGHT, MIN_REMAINING_MAIN_AREA } from "../../tool-panel-size";
import { ToolPanelResizeHandle } from "../../ToolPanelResizeHandle";
import { ToolPanelHeader } from "../../ToolPanelHeader";
import { MobileMap } from "@mobile-ui";

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    toolbar: {
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
    },
    withHeader: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    component: {
        flex: 1,
    },
    componentContent: {
        flex: 1,
    },
    dragging: {
        opacity: 0.9,
    },
    collapsed: {
        opacity: 0.7,
    },
    expanded: {
        opacity: 1,
    },
});

interface Props {
    map?: MobileMap;
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
            ? BOTTOM_SECONDARY_PANEL_MIN
            : panelWidths.bottomSecondaryHeight;

    const handleToolSelect = (newId: string | null) => {
        onActiveIdChange(newId);

        if (newId !== null) {
            const thisMin = BOTTOM_SECONDARY_PANEL_MIN;
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
        <View style={styles.container}>
            <View
                style={[
                    styles.toolbar,
                    isDragging && styles.dragging,
                    isCollapsed && styles.collapsed,
                    !isCollapsed && styles.expanded,
                    { 
                        height: effectiveHeight,
                        backgroundColor: theme.componentColor('background', 0.87),
                    },
                ]}
            >
                <View style={[styles.content, showHeader && styles.withHeader]}>
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
                        <View style={styles.component}>
                            <View style={styles.componentContent}>
                                <toolPanel.contentComponent map={map} placement={toolPanel.placement} />
                            </View>
                        </View>
                    ) : null}
                </View>
            </View>
            <ToolPanelResizeHandle
                placement="bottom-secondary"
                onDraggingChange={setIsDragging}
            />
        </View>
    );
};
