import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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

interface VariantGalleryProps<Size extends string, Color extends string, Variant extends string> {
    sizes: readonly Size[];
    colors: readonly Color[];
    variants: readonly Variant[];
    render: (options: { size: Size; color: Color; variant: Variant }) => ReactNode;
    children?: ReactNode;
    scrollEnabled?: boolean;
}

export const VariantGallery = <Size extends string, Color extends string, Variant extends string>({
    sizes,
    colors,
    variants,
    render,
    children,
    scrollEnabled,
}: VariantGalleryProps<Size, Color, Variant>) => {
    const content = (
        <>
            {children}
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
