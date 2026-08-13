import { FC, useLayoutEffect, useRef } from "react";
import { LayoutAnimation, StyleSheet, View } from "react-native";
import { assignBottomToolPanelRef, useBottomToolPanel, useMachineWard } from "@apparatus";
import { BottomToolPanelHeader } from "./BottomToolPanelHeader";
import { MobileMap } from "@mobile-ui";
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
    joinHeaderButtons?: boolean;
}

export const BottomToolPanel: FC<Props> = ({
    map,
    activeId,
    onActiveIdChange,
    joinHeaderButtons,
}) => {
    const theme = useTheme();
    const { toolsStation } = useMachineWard();
    const { show, toolPanel } = useBottomToolPanel(activeId);

    const prevActiveId = useRef(activeId);
    useLayoutEffect(() => {
        if (prevActiveId.current !== activeId) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            prevActiveId.current = activeId;
        }
    }, [activeId]);

    if (!show) {
        return null;
    }

    return (
        <View ref={assignBottomToolPanelRef(toolsStation)}>
            <View style={[{
                backgroundColor: theme.componentColor('background', 0.87),
                borderTopColor: theme.color('primary'),
            }]}>
                <BottomToolPanelHeader
                    activeId={activeId}
                    onActiveIdChange={onActiveIdChange}
                    joinHeaderButtons={joinHeaderButtons}
                />
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
