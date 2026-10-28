import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import {
    appearanceColorOptions,
    menuItemStoryArgs,
    menuItemStoryControls,
    menuItemStoryStates,
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
        selected: { table: { disable: true } },
        disabled: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            size={args.size}
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
