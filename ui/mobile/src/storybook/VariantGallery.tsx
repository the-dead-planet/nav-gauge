import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ColorVariant, FillVariant, SizeVariant, colorOptions, fillVariantOptions, sizeOptions } from '@ui';
import { Text } from '../typography';

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
    cell: {
        flex: 1,
        minWidth: 0,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
});

interface VariantGalleryProps<Variant extends string = FillVariant> {
    variants?: readonly Variant[];
    render: (options: { size: SizeVariant; color: ColorVariant; variant: Variant }) => ReactNode;
    children?: ReactNode;
    scrollEnabled?: boolean;
}

export const VariantGallery = <Variant extends string = FillVariant>({
    variants = fillVariantOptions as unknown as readonly Variant[],
    render,
    children,
    scrollEnabled,
}: VariantGalleryProps<Variant>) => {
    const content = (
        <>
            {children}
            {sizeOptions.map((size) => (
                <View key={size} style={styles.section}>
                    <Text style={styles.label}>{size}</Text>
                    <View style={styles.row}>
                        {variants.map((variant) => (
                            <View key={variant} style={styles.cell}>
                                <Text>{variant}</Text>
                            </View>
                        ))}
                    </View>
                    {colorOptions.map((color) => (
                        <View key={color} style={styles.row}>
                            {variants.map((variant) => (
                                <View key={`${size}-${color}-${variant}`} style={styles.cell}>
                                    {render({ color, variant, size })}
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            ))}
        </>
    );

    return scrollEnabled === false ? (
        <View style={styles.container}>{content}</View>
    ) : (
        <ScrollView contentContainerStyle={styles.container}>{content}</ScrollView>
    );
};
