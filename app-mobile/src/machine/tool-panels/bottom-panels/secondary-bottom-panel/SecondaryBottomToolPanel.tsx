import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useMachineWard, useSecondaryBottomToolPanel } from "@apparatus";
import { useTheme } from "@ui";
import { ToolPanelHeader } from "../../ToolPanelHeader";
import { BottomSecondaryToolPanelResizeHandle } from "./SecondaryBottomToolPanelResizeHandle";
import { MobileMap } from "@mobile-ui";

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    component: {
        flex: 1,
    },
    componentContent: {
        flex: 1,
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
    const theme = useTheme();
    const { toolsStation } = useMachineWard();
    const [_isDragging, setIsDragging] = useState(false);

    const {
        show,
        effectiveHeight,
        toolPanel,
        handleToolSelect,
    } = useSecondaryBottomToolPanel(activeId, onActiveIdChange);

    if (!show) {
        return null;
    }

    return (
        <View
            ref={(instance) => {
                toolsStation.bottomSecondaryToolPanelSizeRef.current = instance;
            }}
            style={styles.container}>
            <View
                style={{
                    height: effectiveHeight,
                    backgroundColor: theme.componentColor('background', 0.87),
                    borderTopWidth: 1,
                    borderTopColor: theme.color('primary'),
                }}
            >
                <ToolPanelHeader
                    placement="bottom"
                    activeId={activeId}
                    onActiveIdChange={handleToolSelect}
                    headerControls={toolPanel?.headerComponent ? (
                        <toolPanel.headerComponent map={map} placement={toolPanel.placement} />
                    ) : undefined}
                />
                {toolPanel ? (
                    <View style={styles.component}>
                        <View style={styles.componentContent}>
                            <toolPanel.contentComponent map={map} placement={toolPanel.placement} />
                        </View>
                    </View>
                ) : null}
            </View>
            <BottomSecondaryToolPanelResizeHandle onDraggingChange={setIsDragging} />
        </View>
    );
};
