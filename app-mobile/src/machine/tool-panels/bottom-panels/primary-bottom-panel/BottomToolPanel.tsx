import { FC, useCallback, useLayoutEffect, useRef } from "react";
import { LayoutAnimation, StyleSheet, View } from "react-native";
import { useObservableState } from "@tinker-chest";
import { useMachineWard } from "@apparatus";
import { BottomToolPanelHeader } from "./BottomToolPanelHeader";
import { MobileMap, Text } from "@mobile-ui";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    componentHeader: {
        flexDirection: 'row',
        paddingHorizontal: 8,
    },
});

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
    const show = effectivePanels.length > 0;
    const viewRef = useRef<View | null>(null);

    const prevActiveId = useRef(activeId);
    useLayoutEffect(() => {
        if (prevActiveId.current !== activeId) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            prevActiveId.current = activeId;
        }
    }, [activeId]);

    const updateSize = useCallback(() => {
        const view = viewRef.current;
        if (view) {
            view.measure((_x, _y, width, height) => {
                toolsStation.bottomToolPanelSizeRef.current = { clientWidth: width, clientHeight: height };
            });
        }
    }, [toolsStation.bottomToolPanelSizeRef]);

    if (!show) {
        return null;
    }
    
    return (
        <View ref={viewRef} onLayout={updateSize}>
            <View style={[{
                backgroundColor: theme.componentColor('background', 0.87),
                borderTopColor: theme.color('primary'),
            }]}>
                <BottomToolPanelHeader activeId={activeId} onActiveIdChange={onActiveIdChange} />
                <View>
                    {toolPanel ? (
                        <>
                            {toolPanel.headerComponent ? (
                                <View style={styles.componentHeader}>
                                    <toolPanel.headerComponent map={map} placement={toolPanel.placement} />
                                </View>
                            ) : null}
                            <View>
                                <toolPanel.contentComponent map={map} placement={toolPanel.placement} />
                            </View>
                        </>
                    ) : null}
                </View>
            </View>
        </View>
    );
};
