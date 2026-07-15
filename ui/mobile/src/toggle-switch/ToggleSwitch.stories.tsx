import { FC, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ToggleSwitch } from "./ToggleSwitch";
import { Text } from "../typography";
import { ColorVariant, LayoutOrientation, SizeVariant } from "@ui";

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
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    label: {
        width: 40,
    },
});

const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];

export const ToggleSwitchVariants: FC = () => {
    const [checked, setChecked] = useState(false);
    const [size, setSize] = useState<SizeVariant>('sm');
    const [color, setColor] = useState<ColorVariant>('primary');
    const [orientation, setOrientation] = useState<LayoutOrientation>('horizontal');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ToggleSwitch
                size={size}
                color={color}
                orientation={orientation}
                checked={checked}
                onChange={setChecked}
            >
                {checked ? 'On' : 'Off'}
            </ToggleSwitch>

            <View style={styles.section}>
                <Text style={styles.label}>Size</Text>
                <View style={styles.row}>
                    {allSizes.map(s => (
                        <ToggleSwitch
                            key={s}
                            size="xs"
                            color={color}
                            checked={size === s}
                            onChange={() => setSize(s)}
                        >
                            {s}
                        </ToggleSwitch>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Color</Text>
                <View style={styles.row}>
                    {allColors.map(c => (
                        <ToggleSwitch
                            key={c}
                            size="xs"
                            color={c}
                            checked={color === c}
                            onChange={() => setColor(c)}
                        >
                            {c}
                        </ToggleSwitch>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Orientation</Text>
                <View style={styles.row}>
                    {(['horizontal', 'vertical'] as LayoutOrientation[]).map(o => (
                        <ToggleSwitch
                            key={o}
                            size="xs"
                            color={color}
                            checked={orientation === o}
                            onChange={() => setOrientation(o)}
                        >
                            {o}
                        </ToggleSwitch>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text>All combinations (checked)</Text>
                {allSizes.map(s => (
                    <View key={s} style={styles.row}>
                        <Text style={styles.label}>{s}</Text>
                        {allColors.map(c => (
                            <ToggleSwitch key={c} size={s} color={c} checked onChange={() => { }}>
                                {c}
                            </ToggleSwitch>
                        ))}
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text>All combinations (unchecked)</Text>
                {allSizes.map(s => (
                    <View key={s} style={styles.row}>
                        <Text style={styles.label}>{s}</Text>
                        {allColors.map(c => (
                            <ToggleSwitch key={c} size={s} color={c} checked={false} onChange={() => { }}>
                                {c}
                            </ToggleSwitch>
                        ))}
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text>Vertical orientation</Text>
                {allSizes.map(s => (
                    <View key={s} style={[styles.row, { flexDirection: 'column', alignItems: 'center', gap: 16 }]}>
                        <Text>{s}</Text>
                        <View style={{ flexDirection: 'row', gap: 16 }}>
                            {allColors.map(c => (
                                <ToggleSwitch key={c} size={s} color={c} orientation="vertical" checked onChange={() => { }} />
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};
