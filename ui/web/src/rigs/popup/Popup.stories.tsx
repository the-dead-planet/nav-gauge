import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import {
    appearanceColorOptions,
    fillVariantOptions,
    popupStoryArgs,
    popupStoryControls,
    PopupProps,
} from '@ui';
import { Popup } from './Popup';
import { Button } from '../../gizmos/button';
import { VariantGallery } from '../../storybook/VariantGallery';

const meta = {
    title: 'Rigs/Popup',
    component: Popup,
    args: { ...popupStoryArgs, visible: false, onClose: () => undefined },
    argTypes: popupStoryControls,
} satisfies Meta<typeof Popup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
};
makeLiveEditStory(Playground, {
    availableImports: {
        '@web-ui': { Popup, Button },
    },
    code: `import { useRef, useState } from 'react';
import { Popup, Button } from '@web-ui';

export default function Example(args) {
    const anchor = useRef(null);
    const [visible, setVisible] = useState(false);
    return <>
        <Button ref={anchor} onClick={() => setVisible(!visible)}>Toggle popup</Button>
        <Popup {...args} anchor={anchor} visible={visible} onClose={() => setVisible(false)} />
    </>;
}`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
    },
    render: (args) => {
        const [active, setActive] = useState<PopupProps | null>(null);
        return (
            <>
                <VariantGallery
                    colors={appearanceColorOptions}
                    sizes={['default']}
                    variants={fillVariantOptions}
                    render={({ color, variant }) => (
                        <Button
                            color={color}
                            onClick={(event) =>
                                setActive({
                                    ...args,
                                    color,
                                    variant,
                                    anchor: { current: event.currentTarget },
                                    visible: true,
                                    onClose: () => setActive(null),
                                })
                            }
                        >
                            {color} / {variant}
                        </Button>
                    )}
                />
                {active && <Popup {...active} />}
            </>
        );
    },
};
