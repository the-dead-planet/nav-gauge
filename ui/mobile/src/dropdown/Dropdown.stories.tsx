import { FC, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Dropdown } from "./Dropdown";
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
    const [variant, setVariant] = useState<SurfaceFillVariant>('fill-inverse');
    const [value, setValue] = useState('brass');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Dropdown
                size={size}
                color={color}
                variant={variant}
                value={value}
                options={options}
                onChange={setValue}
            />

            <View style={styles.section}>
                <Text>Size</Text>
                <View style={styles.row}>
                    {allSizes.map(s => (
                        <Dropdown
                            key={s}
                            size="xs"
                            value={size}
                            options={allSizes.map(v => ({ value: v, label: v }))}
                            onChange={(v) => setSize(v as SizeVariant)}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text>Color</Text>
                <View style={styles.row}>
                    {allColors.map(c => (
                        <Dropdown
                            key={c}
                            size="xs"
                            color={c}
                            variant="fill"
                            value={color}
                            options={allColors.map(v => ({ value: v, label: v }))}
                            onChange={(v) => setColor(v as ColorVariant)}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text>Variant</Text>
                <View style={styles.row}>
                    {allVariants.map(v => (
                        <Dropdown
                            key={v}
                            size="xs"
                            variant={v}
                            value={variant}
                            options={allVariants.map(x => ({ value: x, label: x }))}
                            onChange={(v) => setVariant(v as SurfaceFillVariant)}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};
