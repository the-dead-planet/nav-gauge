import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Menu, MenuItem } from "@mobile-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { useMachineWard, useMultipleTranslations } from "@apparatus";
import { useTheme } from "@ui";
import { ToolPanelHeader } from "../ToolPanelHeader";
import { DEFAULT_WIDTH, PANEL_MIN, PANEL_MIN_LEFT, calculateExpandToDefault, LEFT_ICONS_WIDTH, RIGHT_ICONS_WIDTH, TOP_TOOLS_MIN, MIN_REMAINING_MAIN_AREA } from "../tool-panel-size";
import { ToolPanelResizeHandle } from "../ToolPanelResizeHandle";
import { MobileMap } from "@mobile-ui";

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
    },
    withHeader: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    component: {
        flex: 1,
    },
    componentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
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
    placement: "left" | "right";
    map?: MobileMap;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
}

export const SideToolPanel: FC<Props> = ({
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
    const _currentWidth = !showHeader ? 0 : isCollapsed ? panelMin : (isLeft ? panelWidths.leftWidth : panelWidths.rightWidth);

    const [isDragging, setIsDragging] = useState(false);

    const handleSidePanelActiveIdChange = (newId: string | null) => {
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
            const column3Min = Math.max(TOP_TOOLS_MIN, MIN_REMAINING_MAIN_AREA.width);
            const maxAvailable = theme.media$.value.windowWidth - otherWidth - iconsReserved - column3Min;
            const clampedWidth = Math.min(Math.max(thisStoredWidth, thisMin), maxAvailable);
            const targetWidth = clampedWidth === thisMin ? DEFAULT_WIDTH : clampedWidth;

            setPanelWidths((prev) => calculateExpandToDefault(
                targetWidth,
                otherWidth,
                thisMin,
                theme.media$.value.windowWidth,
                toolIconsByPlacement.left.length > 0,
                toolIconsByPlacement.right.length > 0,
                isLeft,
                prev,
            ));
        }
    };

    const [
        panelMenuLabel,
        swapPlacementLabel,
    ] = useMultipleTranslations([
        { n: namespace, t: translationKey.PanelMenu },
        { n: namespace, t: translationKey.SwapPlacement, p: { placement: targetPlacement } },
    ]);

    const sideHeader = showHeader ? (
        <ToolPanelHeader
            placement={placement}
            activeId={activeId}
            onActiveIdChange={handleSidePanelActiveIdChange}
        />
    ) : null;

    return (
        <View
            style={[
                styles.dragging,
                isDragging && styles.dragging,
                isCollapsed && styles.collapsed,
                !isCollapsed && styles.expanded,
                {
                    flex: 1,
                    backgroundColor: theme.componentColor('background', 0.87),
                },
            ]}
        >
            {effectivePanels.length > 0 && (
                <View style={[styles.content, showHeader && styles.withHeader]}>
                    {sideHeader}
                    {toolPanel ? (
                        <View style={styles.component}>
                            {toolPanel.placement !== 'bottom' || toolPanel?.headerComponent ? (
                                <View style={styles.componentHeader}>
                                    {toolPanel.headerComponent ? <toolPanel.headerComponent map={map} placement={toolPanel.placement} /> : null}
                                    {toolPanel.placement !== 'bottom' ? (
                                        <Menu
                                            tooltip={panelMenuLabel}
                                            tooltipPlacement="bottom"
                                            placement={toolPanel.placement === "right" ? "bottom-right" : "bottom-left"}
                                            iconActiveColor="secondary"
                                            iconSize="xs"
                                        >
                                            <MenuItem
                                                key="swap-placement"
                                                onPress={() => {
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
                                </View>
                            ) : null}
                            <View style={styles.componentContent}>
                                <toolPanel.contentComponent map={map} placement={toolPanel.placement} />
                            </View>
                        </View>
                    ) : null}
                </View>
            )}
            <ToolPanelResizeHandle
                placement={placement}
                onDraggingChange={setIsDragging}
            />
        </View>
    );
};
