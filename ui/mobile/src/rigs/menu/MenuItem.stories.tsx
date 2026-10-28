import { ComponentProps } from 'react';
import {
    appearanceColorOptions,
    menuItemStoryArgs,
    menuItemStoryControls,
    menuItemStoryStates,
} from '@ui';
import { MenuItem } from './MenuItem';
import { VariantGallery } from '../../storybook/VariantGallery';
import { MobileStoryDefinition } from '../../storybook/model';

const story: MobileStoryDefinition<ComponentProps<typeof MenuItem>> = {
    args: menuItemStoryArgs,
    controls: menuItemStoryControls,
    galleryEditableControls: [
        'children',
        'linkType',
        'highlightColor',
        'glyphsShade',
        'highlightGlyphsShade',
        'highlighted',
    ],
    renderPlayground: (args) => <MenuItem {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={menuItemStoryStates}
            render={({ color, size, variant: state }) => (
                <MenuItem
                    {...args}
                    color={color}
                    size={size}
                    selected={
                        state === 'selected' || state === 'disabled-selected'
                    }
                    disabled={
                        state === 'disabled' || state === 'disabled-selected'
                    }
                />
            )}
        />
    ),
};
export default story;
