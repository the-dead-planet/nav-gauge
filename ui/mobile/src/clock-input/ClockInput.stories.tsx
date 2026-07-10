import { FC, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ClockInput } from "./ClockInput";
import { ClockSliceInput } from "./ClockSliceInput";
import { Button } from "../button";
import { Text } from "../typography";
import { ColorVariant, SizeVariant, SurfaceFillVariant, CLOCK_INPUT_RANGE } from "@ui";

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

export const PitchConstrained: FC = () => {
    const pitchRange: [number, number] = [0, 85];
    const [value, setValue] = useState(30);
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
                <Text style={{ marginBottom: 8 }}>
                    pitch range [{pitchRange[0]}–{pitchRange[1]}] | value: {value}°
                </Text>
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
                                <ClockInput
                                    value={value}
                                    onChange={setValue}
                                    color={color}
                                    variant={variant}
                                    size={size}
                                    label={color}
                                    disabled={disabled}
                                    min={pitchRange[0]}
                                    max={pitchRange[1]}
                                />
                            </View>
                        ))}
                    </View>
                ))}
                <View style={{ marginTop: 16 }}>
                    <Text style={{ marginBottom: 8 }}>
                        full range [{CLOCK_INPUT_RANGE[0]}–{CLOCK_INPUT_RANGE[1]}] for comparison
                    </Text>
                    <ClockInput
                        value={value}
                        onChange={setValue}
                        size={size}
                        disabled={disabled}
                        label="full"
                    />
                </View>
            </View>
        </ScrollView>
    );
};

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
                                <ClockInput
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

export const SliceVariants: FC = () => {
    const pitchRange: [number, number] = [0, 85];
    const [value, setValue] = useState(30);
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
                <Text style={{ marginBottom: 8 }}>
                    pitch [{pitchRange[0]}–{pitchRange[1]}] | value: {value}°
                </Text>
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
                                <ClockSliceInput
                                    value={value}
                                    onChange={setValue}
                                    color={color}
                                    variant={variant}
                                    size={size}
                                    label={color}
                                    disabled={disabled}
                                    min={pitchRange[0]}
                                    max={pitchRange[1]}
                                />
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={{ marginBottom: 8 }}>varying ranges</Text>
                <View style={styles.row}>
                    {([[0, 30], [0, 60], [0, 85]] as [number, number][]).map(([lo, hi]) => (
                        <View key={`${lo}-${hi}`} style={styles.cell}>
                            <ClockSliceInput
                                value={Math.min(value, hi)}
                                onChange={(v) => setValue(v)}
                                color="primary"
                                size={size}
                                label={`${lo}–${hi}`}
                                disabled={disabled}
                                min={lo}
                                max={hi}
                            />
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};
