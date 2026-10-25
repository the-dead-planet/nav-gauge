import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ResizeHandleProps } from "@ui";
import { ResizeHandle } from "./ResizeHandle";
import { Text } from "../../design-system/typography";

const styles = StyleSheet.create({
    stage: { height: 240 },
    panel: { position: "relative", height: "100%" },
    verticalPanel: { position: "relative", width: "100%" },
    handleRight: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: -12,
        width: 24,
    },
    handleTop: {
        position: "absolute",
        left: 0,
        right: 0,
        top: -12,
        height: 24,
    },
});

export const ResizeHandleDemo = (props: ResizeHandleProps) => {
    const [extent, setExtent] = useState(120);
    const requestedExtent = useRef(extent);
    return (
        <View>
            <Text>
                {props.direction}, {props.side ?? "default side"}, {props.color}
                : {Math.round(extent)}px
            </Text>
            <View style={styles.stage}>
                <View
                    style={
                        props.direction === "horizontal"
                            ? [styles.panel, { width: extent }]
                            : [styles.verticalPanel, { height: extent }]
                    }
                >
                    <View
                        style={
                            props.direction === "horizontal"
                                ? styles.handleRight
                                : styles.handleTop
                        }
                    >
                        <ResizeHandle
                            {...props}
                            onDragStart={(position) => {
                                requestedExtent.current = extent;
                                props.onDragStart?.(position);
                            }}
                            onDrag={(delta) => {
                                requestedExtent.current += delta;
                                setExtent(
                                    Math.max(
                                        40,
                                        Math.min(200, requestedExtent.current),
                                    ),
                                );
                                props.onDrag(delta);
                            }}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};
