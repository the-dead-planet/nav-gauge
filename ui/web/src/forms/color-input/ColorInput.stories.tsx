import { ComponentProps, useEffect, useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    colorInputStoryArgs,
    colorInputStoryControls,
    fillVariantOptions,
} from "@ui";
import { ColorInput } from "./ColorInput";
import { VariantGallery } from "../../storybook/VariantGallery";

const InteractiveColorInput = (args: ComponentProps<typeof ColorInput>) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <ColorInput {...args} value={value} onChange={setValue} />;
};

const meta = {
    title: "Forms/ColorInput",
    component: ColorInput,
    args: {
        ...colorInputStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...colorInputStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof ColorInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => <InteractiveColorInput {...args} />,
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { ColorInput } },
    code: `import { useEffect, useState } from 'react';
import { ColorInput } from '@web-ui';

export default function Example(args) {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <ColorInput {...args} value={value} onChange={setValue} />;
}`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <InteractiveColorInput
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                />
            )}
        />
    ),
};
