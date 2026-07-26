import { FC, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ResizeHandle } from "./ResizeHandle";
import { Text } from "../typography";

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 24,
    },
    heading: {
        fontWeight: "700",
    },
    row: {
        height: 400,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#666",
    },
    panel: {
        position: "relative",
        backgroundColor: "#1a1a1a",
        borderRightWidth: 1,
        borderRightColor: "#666",
        overflow: "hidden",
    },
    mapArea: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2a2a2a",
    },
    bottomPanel: {
        height: 400,
        borderWidth: 1,
        borderColor: "#666",
    },
    bottomMap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2a2a2a",
    },
    bottomContent: {
        position: "relative",
        backgroundColor: "#1a1a1a",
        borderTopWidth: 1,
        borderTopColor: "#666",
        overflow: "hidden",
    },
    handleRight: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        width: 8,
    },
    handleTop: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 8,
    },
});

export const HorizontalHandle: FC = () => {
    const [width, setWidth] = useState(200);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Horizontal Resize Handle</Text>
            <Text>Drag the right edge of the sidebar to resize.</Text>
            <View style={styles.row}>
                <View style={[styles.panel, { width }]}>
                    <View style={{ padding: 16 }}>
                        <Text>Sidebar — {Math.round(width)}px</Text>
                    </View>
                    <View style={styles.handleRight}>
                        <ResizeHandle
                            direction="horizontal"
                            onDrag={(delta) => setWidth((prev) => Math.max(80, Math.min(350, prev + delta)))}
                        />
                    </View>
                </View>
                <View style={styles.mapArea}>
                    <Text>Map area</Text>
                </View>
            </View>
        </ScrollView>
    );
};

export const VerticalHandle: FC = () => {
    const [height, setHeight] = useState(150);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Vertical Resize Handle</Text>
            <Text>Drag the top edge of the bottom panel to resize.</Text>
            <View style={styles.bottomPanel}>
                <View style={styles.bottomMap}>
                    <Text>Map area</Text>
                </View>
                <View style={[styles.bottomContent, { height }]}>
                    <View style={{ padding: 16 }}>
                        <Text>Bottom panel — {Math.round(height)}px</Text>
                    </View>
                    <View style={styles.handleTop}>
                        <ResizeHandle
                            direction="vertical"
                            onDrag={(delta) => setHeight((prev) => Math.max(80, Math.min(300, prev - delta)))}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
