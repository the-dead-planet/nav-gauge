import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Menu, MenuItem } from "@mobile-ui";
import { assignSideToolPanelRef, swapSideToolPanelPlacement, useMachineWard, useSideToolPanel } from "@apparatus";
import { useTheme } from "@ui";
import { ToolPanelHeader } from "../ToolPanelHeader";
import { SideToolPanelResizeHandle } from "./SideToolPanelResizeHandle";
import { MobileMap } from "@mobile-ui";

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
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
    const { toolsStation } = useMachineWard();
    const theme = useTheme();
    const [_isDragging, setIsDragging] = useState(false); // TODO: Should disable transition when dragging

    const {
        panelMenuLabel,
        swapPlacementLabel,
        show,
        toolPanel,
        effectivePanels,
        currentWidth,
        handleSidePanelActiveIdChange,
    } = useSideToolPanel(placement, activeId, onActiveIdChange);

    const sideHeader = (
        <ToolPanelHeader
            placement={placement}
            activeId={activeId}
            onActiveIdChange={handleSidePanelActiveIdChange}
        />
    );

    if (!show) {
        return null;
    }

    return (
        <View
            ref={assignSideToolPanelRef(placement, toolsStation)}
            style={[
                {
                    backgroundColor: theme.componentColor('background', 0.87),
                    width: currentWidth,
                },
                placement === 'right'
                    ? { borderLeftWidth: 1, borderLeftColor: theme.color('neutral') }
                    : { borderRightWidth: 1, borderRightColor: theme.color('neutral') },
            ]}
        >
            {effectivePanels.length > 0 && (
                <View style={styles.content}>
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
                                            <MenuItem key="swap-placement" onPress={swapSideToolPanelPlacement(toolPanel, toolsStation)}>
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
            <SideToolPanelResizeHandle placement={placement} onDraggingChange={setIsDragging} />
        </View>
    );
};
