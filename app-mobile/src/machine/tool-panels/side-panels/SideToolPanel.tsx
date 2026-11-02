import { FC, useState } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { Menu, MenuItem, resolveElevationStyle } from "@mobile-ui";
import {
    assignSideToolPanelRef,
    swapSideToolPanelPlacement,
    useSideToolPanel,
} from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useTheme, withColorOpacity } from "@ui";
import { ToolPanelHeader } from "../panel-header/ToolPanelHeader";
import { SideToolPanelResizeHandle } from "./SideToolPanelResizeHandle";
import { MobileMap } from "@mobile-apparatus";
import { useAnimatedSize } from "../useAnimatedSize";

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: "row",
        zIndex: 4,
    },
    componentContainer: {
        flex: 1,
        minHeight: 0,
        minWidth: 0,
    },
    component: {
        flex: 1,
        minHeight: 0,
    },
    componentHeader: {
        flexShrink: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 8,
    },
    componentHeaderSpacer: {
        flex: 1,
    },
    componentContent: {
        flexGrow: 1,
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
    const { toolsStation } = useMobileMachineWard();
    const theme = useTheme();
    const [isDragging, setIsDragging] = useState(false);

    const {
        panelMenuLabel,
        swapPlacementLabel,
        show,
        toolPanel,
        currentWidth,
        handleSidePanelActiveIdChange,
    } = useSideToolPanel(placement, activeId, onActiveIdChange);

    const animatedWidth = useAnimatedSize(currentWidth, {
        animate: !isDragging,
    });

    if (!show) {
        return null;
    }

    return (
        <View
            ref={assignSideToolPanelRef(placement, toolsStation)}
            style={[
                {
                    backgroundColor: withColorOpacity(
                        theme.resolveAppearance().surface,
                        0.87,
                    ),
                    ...resolveElevationStyle(
                        theme,
                        "raised",
                        placement === "right" ? "left" : "right",
                    ),
                },
                placement === "right"
                    ? {
                          borderLeftWidth: 1,
                          borderLeftColor: theme.color("neutral", 500, 0.4),
                      }
                    : {
                          borderRightWidth: 1,
                          borderRightColor: theme.color("neutral", 500, 0.4),
                      },
            ]}
        >
            <Animated.View
                style={{ flex: 1, width: animatedWidth, overflow: "hidden" }}
            >
                <View style={styles.content}>
                    <ToolPanelHeader
                        placement={placement}
                        activeId={activeId}
                        onActiveIdChange={handleSidePanelActiveIdChange}
                    />
                    <View style={styles.componentContainer}>
                        {toolPanel &&
                        (toolPanel.placement !== "bottom" ||
                            toolPanel.headerComponent) ? (
                            <View style={styles.componentHeader}>
                                {toolPanel.headerComponent ? (
                                    <toolPanel.headerComponent
                                        map={map}
                                        placement={toolPanel.placement}
                                    />
                                ) : (
                                    <View
                                        style={styles.componentHeaderSpacer}
                                    />
                                )}
                                {toolPanel.placement !== "bottom" ? (
                                    <Menu
                                        tooltip={panelMenuLabel}
                                        tooltipPlacement="bottom"
                                        placement={
                                            toolPanel.placement === "right"
                                                ? "bottom-right"
                                                : "bottom-left"
                                        }
                                        iconActiveColor="secondary"
                                        iconSize="xs"
                                    >
                                        <MenuItem
                                            key="swap-placement"
                                            onPress={swapSideToolPanelPlacement(
                                                toolPanel,
                                                toolsStation,
                                            )}
                                        >
                                            {swapPlacementLabel}
                                        </MenuItem>
                                    </Menu>
                                ) : null}
                            </View>
                        ) : null}
                        <ScrollView
                            style={styles.component}
                            contentContainerStyle={styles.componentContent}
                        >
                            {toolPanel ? (
                                <toolPanel.contentComponent
                                    map={map}
                                    placement={toolPanel.placement}
                                />
                            ) : null}
                        </ScrollView>
                    </View>
                </View>
            </Animated.View>
            <SideToolPanelResizeHandle
                placement={placement}
                onDraggingChange={setIsDragging}
            />
        </View>
    );
};
