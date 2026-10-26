import { ComponentProps } from 'react';
import {
    appearanceColorOptions,
    menuItemStoryArgs,
    menuItemStoryControls,
    surfaceVariantOptions,
} from '@ui';
import { MenuItem } from './MenuItem';
import { VariantGallery } from '../../storybook/VariantGallery';
import { MobileStoryDefinition } from '../../storybook/model';

const story: MobileStoryDefinition<ComponentProps<typeof MenuItem>> = {
    args: menuItemStoryArgs,
    controls: menuItemStoryControls,
    galleryEditableControls: [
        'children',
        'highlightColor',
        'glyphsShade',
        'highlightGlyphsShade',
        'highlighted',
        'disabled',
    ],
    renderPlayground: (args) => <MenuItem {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={surfaceVariantOptions}
            render={({ color, size, variant }) => (
                <MenuItem
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                />
            )}
        />
    ),
};
export default story;
