import { FC, useState } from 'react';
import { VariantGallery } from '../../storybook/VariantGallery';
import { ColorInput } from './ColorInput';

export const Playground: FC = () => {
    const [value, setValue] = useState('#ff6600');

    return (
        <ColorInput
            label="Border color"
            value={value}
            contentShade={700}
            highlightContentShade={200}
            onChange={setValue}
        />
    );
};

export const Gallery: FC = () => (
    <VariantGallery
        render={({ color, size, variant }) => (
            <ColorInput
                label={color}
                value="#ff6600"
                color={color}
                size={size}
                variant={variant}
                onChange={() => {}}
            />
        )}
    />
);
