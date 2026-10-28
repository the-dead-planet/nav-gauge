import { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import {
    appearanceColorOptions,
    tabstripStoryArgs,
    tabstripStoryControls,
    fillVariantOptions,
} from '@ui';
import { Tabstrip } from './Tabstrip';
import { VariantGallery } from '../../storybook/VariantGallery';

const meta = {
    title: 'Rigs/Tabstrip',
    component: Tabstrip,
    args: { ...tabstripStoryArgs, onChange: () => undefined },
    argTypes: tabstripStoryControls,
} satisfies Meta<typeof Tabstrip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
};
makeLiveEditStory(Playground, {
    availableImports: { '@web-ui': { Tabstrip } },
    code: `import { useState } from 'react';
import { Tabstrip } from '@web-ui';

export default function Example(args) {
    const [value, setValue] = useState(args.value);
    return <Tabstrip {...args} value={value} onChange={setValue} />;
}`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
    },
    render: (args) => {
        const [value, setValue] = useState(args.value);
        return (
            <VariantGallery
                colors={appearanceColorOptions}
                size={args.size}
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
        );
    },
};
