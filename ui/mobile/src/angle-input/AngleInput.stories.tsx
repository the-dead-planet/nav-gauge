import { FC, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { AngleInput } from "./AngleInput";
import { Button } from "../button";
import { Text } from "../typography";
import { ColorVariant, SizeVariant, SurfaceFillVariant } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        paddingVertical: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 4,
    },
    cell: {
        flex: 1,
        alignItems: 'center',
    },
    headerLabel: {
        textAlign: 'center',
        fontSize: 11,
    },
});

const allSizes: SizeVariant[] = ['sm', 'md'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: SurfaceFillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

export const AllVariants: FC = () => {
    const [value, setValue] = useState(45);
    const [size, setSize] = useState<SizeVariant>('sm');
    const [disabled, setDisabled] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={[styles.row, { marginBottom: 12 }]}>
                {allSizes.map((s) => (
                    <Button
                        key={s}
                        variant={size === s ? 'fill' : 'ghost'}
                        color="primary"
                        size="xs"
                        corners="rounded"
                        active={size === s}
                        onPress={() => setSize(s)}
                    >
                        {s}
                    </Button>
                ))}
                <Button
                    variant={disabled ? 'fill' : 'ghost'}
                    color="primary"
                    size="xs"
                    corners="rounded"
                    active={disabled}
                    onPress={() => setDisabled((d) => !d)}
                >
                    disabled: {String(disabled)}
                </Button>
            </View>

            <View style={[styles.section, { marginTop: 8 }]}>
                <Text style={{ marginBottom: 8 }}>size: {size} | value: {value}°</Text>
                <View style={styles.row}>
                    {allVariants.map((variant) => (
                        <View key={variant} style={styles.cell}>
                            <Text style={styles.headerLabel}>{variant}</Text>
                        </View>
                    ))}
                </View>
                {allColors.map((color) => (
                    <View key={color} style={styles.row}>
                        {allVariants.map((variant) => (
                            <View key={variant} style={styles.cell}>
                                <AngleInput
                                    value={value}
                                    onChange={setValue}
                                    color={color}
                                    variant={variant}
                                    size={size}
                                    label={color}
                                    disabled={disabled}
                                />
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};
