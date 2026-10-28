import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import {
    appearanceColorOptions,
    dialogStoryArgs,
    dialogStoryControls,
    DialogProps,
    fillVariantOptions,
} from '@ui';
import { Dialog } from './Dialog';
import { Button } from '../../gizmos/button';
import { VariantGallery } from '../../storybook/VariantGallery';

const meta = {
    title: 'Rigs/Dialog',
    component: Dialog,
    args: { ...dialogStoryArgs, onClose: () => undefined },
    argTypes: dialogStoryControls,
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
};
makeLiveEditStory(Playground, {
    availableImports: { '@web-ui': { Dialog, Button } },
    code: `import { useState } from 'react';
import { Dialog, Button } from '@web-ui';

export default function Example(args) {
    const [open, setOpen] = useState(false);
    return <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        {open && <Dialog {...args} onClose={() => setOpen(false)} />}
    </>;
}`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
    },
    render: (args) => {
        const [active, setActive] = useState<DialogProps | null>(null);
        return (
            <>
                <VariantGallery
                    colors={appearanceColorOptions}
                    variants={fillVariantOptions}
                    render={({ color, size, variant }) => (
                        <Button
                            color={color}
                            size={size}
                            onClick={() =>
                                setActive({
                                    ...args,
                                    color,
                                    variant,
                                    onClose: () => setActive(null),
                                })
                            }
                        >
                            {color} / {variant}
                        </Button>
                    )}
                />
                {active && <Dialog {...active} />}
            </>
        );
    },
};
