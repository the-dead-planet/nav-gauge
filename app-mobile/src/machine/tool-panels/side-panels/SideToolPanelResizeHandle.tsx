import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { ResizeHandle } from "@mobile-ui";
import { useSideToolPanelResizeHandle } from "@apparatus";

const styles = StyleSheet.create({
    resizeHandleContainer: {
        position: 'absolute',
        zIndex: 100,
    },
    resizeHandleLeft: {
        right: -4,
        top: 0,
        bottom: 0,
    },
    resizeHandleRight: {
        left: -4,
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
            <ResizeHandle
                direction="horizontal"
                onDrag={handleDrag}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            />
        </View>
    );
};
