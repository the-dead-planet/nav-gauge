import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useBottomSecondaryToolPanelResizeHandle } from "@apparatus";
import { MachineResizeHandle } from "../../MachineResizeHandle";
import { RESIZE_HANDLE_TOUCH_SIZE } from "@ui";

const styles = StyleSheet.create({
    resizeHandleContainer: {
        position: 'absolute',
        zIndex: 100,
        elevation: 6,
    },
    resizeHandle: {
        top: -RESIZE_HANDLE_TOUCH_SIZE / 2,
        left: 0,
        right: 0,
        height: RESIZE_HANDLE_TOUCH_SIZE,
    },
});

interface Props {
    onDraggingChange?: (isDragging: boolean) => void;
}

export const BottomSecondaryToolPanelResizeHandle: FC<Props> = ({
    onDraggingChange,
}) => {
    const {
        handleVerticalDragStart,
        handleVerticalDrag,
        handleVerticalDragEnd,
    } = useBottomSecondaryToolPanelResizeHandle(onDraggingChange);

    return (
        <View style={[styles.resizeHandleContainer, styles.resizeHandle]}>
            <MachineResizeHandle
                direction="vertical"
                side="top"
                color="primary"
                onDrag={handleVerticalDrag}
                onDragStart={handleVerticalDragStart}
                onDragEnd={handleVerticalDragEnd}
            />
        </View>
    );
};
