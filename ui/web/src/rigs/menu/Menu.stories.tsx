import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import {
    appearanceColorOptions,
    menuStoryArgs,
    menuStoryControls,
    sizeOptions,
    surfaceVariantOptions,
} from '@ui';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { VariantGallery } from '../../storybook/VariantGallery';

const meta = {
    title: 'Rigs/Menu',
    component: Menu,
    args: menuStoryArgs,
    argTypes: menuStoryControls,
} satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
};
makeLiveEditStory(Playground, {
    availableImports: { '@web-ui': { Menu, MenuItem } },
    code: `import { Menu, MenuItem } from '@web-ui';

export default function Example(args) {
    return <Menu {...args}>
        <MenuItem key="open" type="button" closeOnPress>Open route</MenuItem>
        <MenuItem key="selected" type="button" selected>Selected route</MenuItem>
        <MenuItem key="disabled" type="button" disabled>Unavailable</MenuItem>
        <MenuItem key="internal" type="link" href="#route">Route link</MenuItem>
        <MenuItem key="external" type="link" href="/legal" target="_blank" rel="noreferrer">Legal in a new tab</MenuItem>
    </Menu>;
}`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
        iconSize: { table: { disable: true } },
        size: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            sizes={sizeOptions}
            variants={surfaceVariantOptions}
            render={({ color, size, variant }) => (
                <Menu
                    {...args}
                    color={color}
                    iconSize={size}
                    size={size}
                    variant={variant}
                >
                    <MenuItem key="default" type="button" closeOnPress>
                        Open route
                    </MenuItem>
                    <MenuItem key="selected" type="button" selected>
                        Selected route
                    </MenuItem>
                    <MenuItem key="disabled" type="button" selected disabled>
                        Unavailable
                    </MenuItem>
                    <MenuItem key="internal" type="link" href="#route">
                        Route link
                    </MenuItem>
                    <MenuItem
                        key="external"
                        type="link"
                        href="/legal"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Legal in a new tab
                    </MenuItem>
                </Menu>
            )}
        />
    ),
};
