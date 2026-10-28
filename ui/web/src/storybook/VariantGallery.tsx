import { ReactNode } from 'react';
import { DEFAULT_SIZE, SizeVariant } from '@ui';
import { Text } from '../design-system/typography';
import styles from './variant-gallery.module.css';

interface VariantGalleryProps<Color extends string, Variant extends string> {
    size?: SizeVariant;
    colors: readonly Color[];
    variants: readonly Variant[];
    render: (options: {
        size: SizeVariant;
        color: Color;
        variant: Variant;
    }) => ReactNode;
}

export const VariantGallery = <Color extends string, Variant extends string>({
    size = DEFAULT_SIZE,
    colors,
    variants,
    render,
}: VariantGalleryProps<Color, Variant>) => (
    <table className={styles.gallery}>
        <caption>{size}</caption>
        <thead>
            <tr>
                {variants.map((variant) => (
                    <th key={variant} scope="col">
                        <Text>{variant}</Text>
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {colors.map((color) => (
                <tr key={color}>
                    {variants.map((variant) => (
                        <td key={variant}>
                            {render({ color, variant, size })}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);
