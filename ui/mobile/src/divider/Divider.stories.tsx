import { FC } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Divider } from "./Divider";
import { Text } from "../typography";
import { ColorVariant } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 24,
    },
    section: {
        gap: 8,
    },
    row: {
        flexDirection: "row",
        gap: 16,
        height: 80,
        alignItems: "stretch",
    },
    colorRow: {
        flexDirection: "row",
        gap: 16,
        height: 80,
        alignItems: "stretch",
    },
    colorItem: {
        alignItems: "center",
        gap: 4,
    },
    heading: {
        fontWeight: "700",
    },
});

const allColors: ColorVariant[] = ["neutral", "primary", "secondary", "tertiary"];

export const DividerVariants: FC = () => (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
            <Text style={styles.heading}>Horizontal (default)</Text>
            <Divider />
        </View>

        <View style={styles.section}>
            <Text style={styles.heading}>Horizontal with colors</Text>
            {allColors.map((c) => (
                <View key={c} style={{ gap: 4 }}>
                    <Text>{c}</Text>
                    <Divider color={c} />
                </View>
            ))}
        </View>

        <View style={styles.section}>
            <Text style={styles.heading}>Vertical</Text>
            <View style={styles.row}>
                <Text>Left</Text>
                <Divider orientation="vertical" />
                <Text>Center</Text>
                <Divider orientation="vertical" color="primary" />
                <Text>Right</Text>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.heading}>Vertical with all colors</Text>
            <View style={styles.colorRow}>
                {allColors.map((c) => (
                    <View key={c} style={styles.colorItem}>
                        <Divider orientation="vertical" color={c} />
                        <Text>{c}</Text>
                    </View>
                ))}
            </View>
        </View>
    </ScrollView>
);
