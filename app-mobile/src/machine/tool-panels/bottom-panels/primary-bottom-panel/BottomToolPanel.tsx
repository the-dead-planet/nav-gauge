import { FC, useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useObservableState } from "@tinker-chest";
import { useMachineWard } from "@apparatus";
import { BottomToolPanelHeader } from "./BottomToolPanelHeader";
import { MobileMap } from "@mobile-ui";
import { useTheme } from "@ui";

interface Props {
    map?: MobileMap;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
}

export const BottomToolPanel: FC<Props> = ({
    map,
    activeId,
    onActiveIdChange,
}) => {
    const theme = useTheme();
    const { toolsStation } = useMachineWard();
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = toolPanelsByPlacement["bottom"];
    const toolPanel = effectivePanels.find(({ id }) => id === activeId);
    const showHeader = effectivePanels.length > 0;
    const viewRef = useRef<View | null>(null);

    const updateSize = useCallback(() => {
        const view = viewRef.current;
        if (view) {
            view.measure((_x, _y, width, height) => {
                toolsStation.bottomToolPanelSizeRef.current = { clientWidth: width, clientHeight: height };
            });
        }
    }, [toolsStation.bottomToolPanelSizeRef]);

    return (
        <View
            ref={viewRef}
            onLayout={updateSize}
            style={[styles.toolbar, {
                backgroundColor: theme.componentColor('background', 0.87),
            }]}
        >
            {effectivePanels.length > 0 && (
                <View style={[styles.content, showHeader && styles.withHeader]}>
                    <BottomToolPanelHeader
                        activeId={activeId}
                        onActiveIdChange={onActiveIdChange}
                    />
                    {toolPanel ? (
                        <View style={styles.component}>
                            {toolPanel.headerComponent ? (
                                <View style={styles.componentHeader}>
                                    <toolPanel.headerComponent map={map} placement={toolPanel.placement} />
                                </View>
                            ) : null}
                            <View style={styles.componentContent}>
                                <toolPanel.contentComponent map={map} placement={toolPanel.placement} />
                            </View>
                        </View>
                    ) : null}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    toolbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
    },
    content: {
        flex: 1,
        backgroundColor: 'transparent',
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
});
