import { FC, useState } from 'react';
import { ColorVariant, FillVariant, SizeVariant } from '@ui';
import { VariantGallery } from '../../storybook/VariantGallery';
import { NumberInput } from './NumberInput';

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

    return (
        <NumberInput
            label="Value"
            value={value}
            onChange={setValue}
            contentShade={700}
            highlightContentShade={200}
            step={0.1}
            unit="px"
        />
    );
};

export const Gallery: FC = () => (
    <VariantGallery
        render={(options) => <GalleryNumberInput {...options} />}
    />
);
