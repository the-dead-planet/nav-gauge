import { FC, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Dropdown } from "./Dropdown";
import { Radio } from "../forms";
import { Text } from "../typography";
import { ColorVariant, Icons, SizeVariant, SurfaceFillVariant } from "@ui";

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
        flexWrap: 'wrap',
    },
});

const options = [
    { value: 'brass', label: 'Brass Cog', icon: Icons.Beaker },
    { value: 'copper', label: 'Copper Valve', icon: Icons.Beaker },
    { value: 'steam', label: 'Steam Pipe', icon: Icons.Beaker },
    { value: 'gear', label: 'Gear Assembly', icon: Icons.Beaker },
];

const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: SurfaceFillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

export const DropdownVariants: FC = () => {
    const [size, setSize] = useState<SizeVariant>('md');
    const [color, setColor] = useState<ColorVariant>('neutral');
    const [highlightColor, setHighlightColor] = useState<ColorVariant>();
    const [variant, setVariant] = useState<SurfaceFillVariant>('fill-inverse');
    const [value, setValue] = useState('brass');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Dropdown
                size={size}
                color={color}
                highlightColor={highlightColor}
                variant={variant}
                value={value}
                options={options}
                onChange={setValue}
            />
            <Dropdown value={value} options={options} disabled />

            <View style={styles.section}>
                <Text>Size</Text>
                <View style={styles.row}>
                    {allSizes.map(option => (
                        <Radio key={option} size="xs" checked={size === option} onChange={() => setSize(option)}>
                            {option}
                        </Radio>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text>Color</Text>
                <View style={styles.row}>
                    {allColors.map(option => (
                        <Radio key={option} size="xs" color={option} checked={color === option} onChange={() => setColor(option)}>
                            {option}
                        </Radio>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text>Highlight color (background only in the list)</Text>
                <View style={styles.row}>
                    <Radio size="xs" checked={highlightColor === undefined} onChange={() => setHighlightColor(undefined)}>
                        Default
                    </Radio>
                    {allColors.map(option => (
                        <Radio key={option} size="xs" color={option} checked={highlightColor === option} onChange={() => setHighlightColor(option)}>
                            {option}
                        </Radio>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text>Variant</Text>
                <View style={styles.row}>
                    {allVariants.map(option => (
                        <Radio key={option} size="xs" checked={variant === option} onChange={() => setVariant(option)}>
                            {option}
                        </Radio>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};
