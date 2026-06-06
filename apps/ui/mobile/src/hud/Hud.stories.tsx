import { FC } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Hexagon } from "./Hexagon";
import { FlexBox } from "../flex-box";
import { ColorVariant, useTheme } from "@ui";

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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <FlexBox direction="column" gap="xl">
                <View style={styles.section}>
                    <Text style={styles.label}>pointy-top (default)</Text>
                    <Hexagon variant="pointy-top" style={{ width: 120 }} color="primary">
                        <Text style={{ color: textColor("primary") }}>1</Text>
                    </Hexagon>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>flat-top</Text>
                    <Hexagon variant="flat-top" style={{ width: 120 }} color="secondary">
                        <Text style={{ color: textColor("secondary") }}>2</Text>
                    </Hexagon>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>sizes</Text>
                    <View style={styles.row}>
                        <Hexagon style={{ width: 60 }} color="tertiary" />
                        <Hexagon style={{ width: 100 }} color="tertiary" />
                        <Hexagon style={{ width: 140 }} color="tertiary" />
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
