import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useSideToolPanelResizeHandle } from "@apparatus";
import { MachineResizeHandle } from "../MachineResizeHandle";
import { RESIZE_HANDLE_TOUCH_SIZE } from "@ui";

const styles = StyleSheet.create({
    resizeHandleContainer: {
        position: 'absolute',
        width: RESIZE_HANDLE_TOUCH_SIZE,
        zIndex: 100,
    },
    resizeHandleLeft: {
        right: -RESIZE_HANDLE_TOUCH_SIZE / 2,
        top: 0,
        bottom: 0,
    },
    resizeHandleRight: {
        left: -RESIZE_HANDLE_TOUCH_SIZE / 2,
        top: 0,
        bottom: 0,
    },
});

interface Props {
    placement: "left" | "right";
    onDraggingChange: (isDragging: boolean) => void;
}

export const SideToolPanelResizeHandle: FC<Props> = ({
    placement,
    onDraggingChange,
}) => {
    const isLeft = placement === 'left';

    const {
        handleDragStart,
        handleDrag,
        handleDragEnd,
    } = useSideToolPanelResizeHandle(placement, onDraggingChange);

    return (
        <View style={[
            styles.resizeHandleContainer,
            isLeft ? styles.resizeHandleLeft : styles.resizeHandleRight,
        ]}>
            <MachineResizeHandle
                color="neutral"
                highlightColor="secondary"
                direction="horizontal"
                side={placement === 'left' ? 'right' : 'left'}
                onDrag={handleDrag}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            />
        </View>
    );
};
