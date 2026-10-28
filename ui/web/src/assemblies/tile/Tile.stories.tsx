import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { tileStoryArgs } from '@ui';
import { Button } from '../../gizmos/button';
import { colorOptions, fillVariantOptions } from '../../storybook/controls';
import { VariantGallery } from '../../storybook/VariantGallery';
import { Tile } from './Tile';

const meta = {
    title: 'Assemblies/Tile',
    component: Tile,
    args: {
        ...tileStoryArgs,
        append: <Button size="xs">Info</Button>,
        children: <div style={{ minHeight: 80 }} />,
        actions: (size, variants) => <Button size={size} variant={variants.active}>Open</Button>,
        panelProps: { variant: 'fill-inverse' },
    },
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Gallery: Story = {
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={colorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <Tile
                    {...args}
                    size={size}
                    panelProps={{ ...args.panelProps, color, variant }}
                    actions={(actionSize, variants) => (
                        <Button size={actionSize} variant={variants.active}>
                            Open
                        </Button>
                    )}
                />
            )}
        />
    ),
};
