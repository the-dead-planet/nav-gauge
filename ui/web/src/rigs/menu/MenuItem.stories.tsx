import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import {
    appearanceColorOptions,
    menuItemStoryArgs,
    menuItemStoryControls,
    sizeOptions,
    surfaceVariantOptions,
} from '@ui';
import { MenuItem } from './MenuItem';
import { VariantGallery } from '../../storybook/VariantGallery';

const meta = {
    title: 'Rigs/MenuItem',
    component: MenuItem,
    args: { ...menuItemStoryArgs, type: 'button' },
    argTypes: menuItemStoryControls,
} satisfies Meta<typeof MenuItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
};
makeLiveEditStory(Playground, {
    availableImports: { '@web-ui': { MenuItem } },
    code: `import { MenuItem } from '@web-ui';

export default MenuItem;`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
        size: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            sizes={sizeOptions}
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
