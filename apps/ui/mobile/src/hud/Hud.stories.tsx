import { FC } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Hexagon } from "./Hexagon";
import { FlexBox } from "../flex-box";
import { Text } from "../typography";
import { ColorVariant, HexagonShape, useTheme } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        paddingVertical: 12,
    },
    label: {
        marginBottom: 8,
        fontWeight: "700",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
});

export const All: FC = () => {
    const theme = useTheme();
    const textColor = (color: ColorVariant) => theme.color(color, 500);
    const shapes: HexagonShape[] = ["pointy-top", "flat-top"];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <FlexBox direction="column" gap="xl">
                {shapes.map((s) => (
                    <View key={s} style={styles.section}>
                        <Text style={styles.label}>{s}</Text>
                        <Hexagon shape={s} style={{ width: 120 }} color="primary">
                            <Text style={{ color: textColor("primary") }}>1</Text>
                        </Hexagon>
                    </View>
                ))}

                <View style={styles.section}>
                    <Text style={styles.label}>sizes</Text>
                    <View style={styles.row}>
                        <Hexagon size="xs" color="tertiary">
                            <Text color="tertiary">xs</Text>
                        </Hexagon>
                        <Hexagon size="sm" color="tertiary">
                            <Text color="tertiary">sm</Text>
                        </Hexagon>
                        <Hexagon size="md" color="tertiary">
                            <Text color="tertiary">md</Text>
                        </Hexagon>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>stroke width</Text>
                    <View style={styles.row}>
                        <Hexagon strokeWidth={1} style={{ width: 100 }} color="primary" />
                        <Hexagon strokeWidth={3} style={{ width: 100 }} color="primary" />
                        <Hexagon strokeWidth={5} style={{ width: 100 }} color="primary" />
                    </View>
                </View>
            </FlexBox>
        </ScrollView>
    );
};
