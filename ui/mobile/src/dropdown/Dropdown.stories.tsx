import { FC, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ColorVariant, FillVariant, Icons, SizeVariant, Theme } from '@ui';
import { ColorBox } from '../colors';
import { Radio } from '../forms';
import { Text } from '../typography';
import { Dropdown } from './Dropdown';

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
    },
    section: {
        paddingVertical: 12,
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    wrappingRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    cell: {
        flex: 1,
        minWidth: 0,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
});

const options = [
    {
        value: 'brass',
        label: 'Brass Cog',
        prepend: <ColorBox color={Theme.palette.copper} />,
        icon: Icons.Beaker,
    },
    { value: 'copper', label: 'Copper Valve', icon: Icons.Beaker },
    { value: 'steam', label: 'Steam Pipe', icon: Icons.Beaker },
    { value: 'gear', label: 'Gear Assembly', icon: Icons.Beaker },
];

const colors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const sizes: SizeVariant[] = ['xs', 'sm', 'md'];
const variants: FillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

const GalleryDropdown: FC<{
    color: ColorVariant;
    variant: FillVariant;
    size: SizeVariant;
}> = ({ color, variant, size }) => {
    const [value, setValue] = useState('brass');

    return (
        <Dropdown
            value={value}
            options={options}
            onChange={setValue}
            color={color}
            highlightColor={color}
            variant={variant}
            size={size}
        />
    );
};

export const Playground: FC = () => {
    const [size, setSize] = useState<SizeVariant>('sm');
    const [color, setColor] = useState<ColorVariant>('neutral');
    const [highlightColor, setHighlightColor] = useState<ColorVariant>('neutral');
    const [variant, setVariant] = useState<FillVariant>('fill-inverse');
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
            <View style={styles.section}>
                <Text style={styles.label}>Size: {size}</Text>
                <View style={styles.wrappingRow}>
                    {sizes.map((option) => (
                        <Radio
                            key={option}
                            size="xs"
                            checked={size === option}
                            onChange={() => setSize(option)}
                        >
                            {option}
                        </Radio>
                    ))}
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Color: {color}</Text>
                <View style={styles.wrappingRow}>
                    {colors.map((option) => (
                        <Radio
                            key={option}
                            size="xs"
                            color={option}
                            checked={color === option}
                            onChange={() => setColor(option)}
                        >
                            {option}
                        </Radio>
                    ))}
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Highlight: {highlightColor}</Text>
                <View style={styles.wrappingRow}>
                    {colors.map((option) => (
                        <Radio
                            key={option}
                            size="xs"
                            color={option}
                            checked={highlightColor === option}
                            onChange={() => setHighlightColor(option)}
                        >
                            {option}
                        </Radio>
                    ))}
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Variant: {variant}</Text>
                <View style={styles.wrappingRow}>
                    {variants.map((option) => (
                        <Radio
                            key={option}
                            size="xs"
                            checked={variant === option}
                            onChange={() => setVariant(option)}
                        >
                            {option}
                        </Radio>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export const Gallery: FC = () => (
    <ScrollView contentContainerStyle={styles.container}>
        {sizes.map((size) => (
            <View key={size} style={styles.section}>
                <Text style={styles.label}>{size}</Text>
                <View style={styles.row}>
                    {variants.map((variant) => (
                        <View key={variant} style={styles.cell}>
                            <Text>{variant}</Text>
                        </View>
                    ))}
                </View>
                {colors.map((color) => (
                    <View key={color} style={styles.row}>
                        {variants.map((variant) => (
                            <View key={`${size}-${color}-${variant}`} style={styles.cell}>
                                <GalleryDropdown
                                    color={color}
                                    variant={variant}
                                    size={size}
                                />
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        ))}
    </ScrollView>
);
