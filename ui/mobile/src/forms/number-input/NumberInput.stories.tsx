import { FC, useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { ColorVariant, FillVariant, SizeVariant, colorOptions, fillVariantOptions, sizeOptions } from '@ui';
import { VariantGallery } from '../../storybook/VariantGallery';
import { Text } from '../../typography';
import { NumberInput } from './NumberInput';

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
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
});

const allSizes = [...sizeOptions].reverse();
const allColors = colorOptions;
const allVariants = fillVariantOptions;

const GalleryNumberInput: FC<{
    color: ColorVariant;
    variant: FillVariant;
    size: SizeVariant;
}> = ({ color, variant, size }) => {
    const [value, setValue] = useState(42);

    return (
        <NumberInput
            ariaLabel={`${color} ${variant} ${size}`}
            value={value}
            onChange={setValue}
            color={color}
            highlightColor={color}
            variant={variant}
            size={size}
            unit="px"
            autoSelect
        />
    );
};

export const Playground: FC = () => {
    const [value, setValue] = useState(50);
    const [color, setColor] = useState<ColorVariant>('neutral');
    const [size, setSize] = useState<SizeVariant>('sm');
    const [variant, setVariant] = useState<FillVariant>('fill-inverse');
    const [disabled, setDisabled] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <NumberInput
                label="Value"
                value={value}
                onChange={setValue}
                color={color}
                size={size}
                variant={variant}
                disabled={disabled}
                step={0.1}
                unit="px"
            />
            <NumberInput
                label="Without step controls"
                value={value}
                onChange={setValue}
                showStepControls={false}
            />
            <Text style={styles.label}>Current value: {value}</Text>
            <View style={styles.section}>
                <Text style={styles.label}>Color: {color}</Text>
                <View style={styles.row}>
                    {allColors.map((option) => (
                        <Switch
                            key={option}
                            value={color === option}
                            onValueChange={() => setColor(option)}
                        />
                    ))}
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Size: {size}</Text>
                <View style={styles.row}>
                    {allSizes.map((option) => (
                        <Switch
                            key={option}
                            value={size === option}
                            onValueChange={() => setSize(option)}
                        />
                    ))}
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Variant: {variant}</Text>
                <View style={styles.row}>
                    {allVariants.map((option) => (
                        <Switch
                            key={option}
                            value={variant === option}
                            onValueChange={() => setVariant(option)}
                        />
                    ))}
                </View>
            </View>
            <View style={styles.row}>
                <Text>Disabled</Text>
                <Switch value={disabled} onValueChange={setDisabled} />
            </View>
        </ScrollView>
    );
};

export const Gallery: FC = () => (
    <VariantGallery
        sizes={allSizes}
        colors={allColors}
        variants={allVariants}
        render={(options) => <GalleryNumberInput {...options} />}
    />
);
