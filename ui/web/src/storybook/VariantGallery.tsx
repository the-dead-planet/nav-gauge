import { ReactNode } from 'react';
import { Text } from '../typography';

interface VariantGalleryProps<Size extends string, Color extends string, Variant extends string> {
    sizes: readonly Size[];
    colors: readonly Color[];
    variants: readonly Variant[];
    render: (options: { size: Size; color: Color; variant: Variant }) => ReactNode;
}

export const VariantGallery = <Size extends string, Color extends string, Variant extends string>({
    sizes,
    colors,
    variants,
    render,
}: VariantGalleryProps<Size, Color, Variant>) => (
    <div style={{ display: 'grid', gap: 40 }}>
        {sizes.map((size) => (
            <div key={size}>
                <Text>{size}</Text>
                <div style={{ display: 'grid', gap: 8 }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${variants.length}, 1fr)`,
                            gap: 8,
                        }}
                    >
                        {variants.map((variant) => (
                            <Text key={variant}>{variant}</Text>
                        ))}
                    </div>
                    {colors.map((color) => (
                        <div
                            key={color}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${variants.length}, 1fr)`,
                                gap: 8,
                            }}
                        >
                            {variants.map((variant) => (
                                <div key={`${color}-${variant}-${size}`}>
                                    {render({ color, variant, size })}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);
