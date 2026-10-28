import { ComponentProps, useState } from 'react';
import { appearanceColorOptions, fillVariantOptions } from '@ui';
import { Tabstrip } from './Tabstrip';
import { VariantGallery } from '../../storybook/VariantGallery';

export const TabstripPreview = ({
    args,
    gallery = false,
}: {
    args: ComponentProps<typeof Tabstrip>;
    gallery?: boolean;
}) => {
    const [value, setValue] = useState(args.value);
    return gallery ? (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <Tabstrip
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                    value={value}
                    onChange={setValue}
                />
            )}
        />
    ) : (
        <Tabstrip {...args} value={value} onChange={setValue} />
    );
};
