import { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "./Button";
import { Text } from "../typography";
import { ColorVariant, ButtonVariant, ButtonCorners } from "@ui";

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingVertical: 8,
    },
    section: {
        paddingVertical: 12,
    },
    label: {
        marginBottom: 8,
    },
});

const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: ButtonVariant[] = ['ghost', 'fill', 'outline', 'inset'];
const allCorners: ButtonCorners[] = ['square', 'rounded', 'circle'];

export const AllVariants: FC = () => (
    <View style={{ padding: 16 }}>
        {allCorners.map((corners) => (
            <View key={corners} style={styles.section}>
                <Text style={styles.label}>{corners}</Text>
                {allVariants.map((variant) => (
                    <View key={variant} style={styles.section}>
                        <Text style={styles.label}>{variant}</Text>
                        <View style={styles.row}>
                            {allColors.map((color) => (
                                <Button
                                    key={color}
                                    variant={variant}
                                    color={color}
                                    corners={corners}
                                >
                                    {color}
                                </Button>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        ))}
    </View>
);

export const ActiveStates: FC = () => (
    <View style={{ padding: 16 }}>
        {allVariants.map((variant) => (
            <View key={variant} style={styles.section}>
                <Text style={styles.label}>{variant} active</Text>
                <View style={styles.row}>
                    {allColors.map((color) => (
                        <Button
                            key={color}
                            variant={variant}
                            color={color}
                            active
                        >
                            {color}
                        </Button>
                    ))}
                </View>
            </View>
        ))}
    </View>
);
