import { FC, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ColorVariant, FillVariant, Icons, SizeVariant, Theme, colorOptions, fillVariantOptions, sizeOptions } from '@ui';
import { ColorBox } from '../colors';
import { Radio } from '../forms';
import { VariantGallery } from '../storybook/VariantGallery';
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
    wrappingRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
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
                    {sizeOptions.map((option) => (
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
                    {colorOptions.map((option) => (
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
                    {colorOptions.map((option) => (
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
                    {fillVariantOptions.map((option) => (
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
    <VariantGallery
        sizes={sizeOptions}
        colors={colorOptions}
        variants={fillVariantOptions}
        render={(options) => <GalleryDropdown {...options} />}
    />
);
