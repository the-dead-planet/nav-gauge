import { ComponentProps } from 'react';
import {
    appearanceColorOptions,
    menuStoryArgs,
    menuStoryControls,
    surfaceVariantOptions,
} from '@ui';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { VariantGallery } from '../../storybook/VariantGallery';
import { MobileStoryDefinition } from '../../storybook/model';

const story: MobileStoryDefinition<ComponentProps<typeof Menu>> = {
    args: menuStoryArgs,
    controls: menuStoryControls,
    galleryEditableControls: [
        'placement',
        'highlightColor',
        'glyphsShade',
        'highlightGlyphsShade',
        'triggerActive',
        'disabled',
    ],
    renderPlayground: (args) => (
        <Menu {...args}>
            <MenuItem key="default" onPress={() => undefined}>
                Open route
            </MenuItem>
            <MenuItem key="selected" highlighted>
                Selected route
            </MenuItem>
            <MenuItem key="disabled" highlighted disabled>
                Unavailable
            </MenuItem>
        </Menu>
    ),
    renderGallery: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={surfaceVariantOptions}
            render={({ color, size, variant }) => (
                <Menu
                    {...args}
                    color={color}
                    iconSize={size}
                    size={size}
                    variant={variant}
                >
                    <MenuItem key="default" onPress={() => undefined}>
                        Open route
                    </MenuItem>
                    <MenuItem key="selected" highlighted>
                        Selected route
                    </MenuItem>
                    <MenuItem key="disabled" highlighted disabled>
                        Unavailable
                    </MenuItem>
                </Menu>
            )}
        />
    ),
};
export default story;
