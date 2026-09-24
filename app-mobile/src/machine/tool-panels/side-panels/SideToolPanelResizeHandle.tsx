import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useSideToolPanelResizeHandle } from "@apparatus";
import { MachineResizeHandle } from "../MachineResizeHandle";

const styles = StyleSheet.create({
    resizeHandleContainer: {
        position: 'absolute',
        width: 24,
        zIndex: 100,
    },
    resizeHandleLeft: {
        right: -12,
        top: 0,
        bottom: 0,
    },
    resizeHandleRight: {
        left: -12,
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
                direction="horizontal"
                side={placement === 'left' ? 'right' : 'left'}
                onDrag={handleDrag}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            />
        </View>
    );
};
