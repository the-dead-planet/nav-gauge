import { FC, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Button } from "./Button";
import { Text } from "../typography";
import { ColorVariant, ButtonVariant, ButtonCorners, SizeVariant, Icons } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        paddingVertical: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 4,
    },
    cell: {
        flex: 1,
    },
    label: {
        marginBottom: 4,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
});

const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: ButtonVariant[] = ['ghost', 'fill', 'outline', 'inset'];
const allCorners: ButtonCorners[] = ['square', 'rounded', 'circle'];

export const AllVariants: FC = () => {
    const [highlightColor, setHighlightColor] = useState<ColorVariant | undefined>(undefined);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.section}>
                <Text>Active highlightColor: {highlightColor ?? 'default'}</Text>
                <View style={styles.row}>
                    {[undefined, ...allColors].map((c) => (
                        <Button
                            key={c ?? 'default'}
                            icon={Icons.Beaker}
                            variant="ghost"
                            color={c}
                            size="xs"
                            corners="rounded"
                            active={highlightColor === c}
                            onPress={() => setHighlightColor(c)}
                        >
                            {c ?? 'default'}
                        </Button>
                    ))}
                </View>
            </View>

            {allSizes.map((size) => (
                <View key={size} style={styles.section}>
                    <Text style={styles.label}>{size}</Text>
                    {allCorners.map((corners) => (
                        <View key={corners} style={styles.section}>
                            <Text style={styles.label}>{corners}</Text>
                            <View style={styles.row}>
                                {allVariants.map((variant) => (
                                    <View key={variant} style={styles.cell}>
                                        <Text style={styles.label}>{variant}</Text>
                                    </View>
                                ))}
                            </View>
                            {allColors.map((color) => (
                                <View key={color} style={styles.row}>
                                    {allVariants.map((variant) => (
                                        <View key={`${size}-${corners}-${color}-${variant}`} style={styles.cell}>
                                            <Button
                                                icon={Icons.Beaker}
                                                variant={variant}
                                                color={color}
                                                corners={corners}
                                                size={size}
                                                highlightColor={highlightColor}
                                            >
                                                {color}
                                            </Button>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};
