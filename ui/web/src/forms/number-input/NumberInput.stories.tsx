import * as React from "react";
import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    fillVariantOptions,
    numberInputStoryArgs,
    numberInputStoryControls,
    NumberInputProps,
} from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";
import { NumberInput } from "./NumberInput";

const GalleryNumberInput = (props: NumberInputProps) => {
    const [value, setValue] = useState(props.value);

    useEffect(() => setValue(props.value), [props.value]);

    return <NumberInput {...props} value={value} onChange={setValue} />;
};

const meta = {
    title: "Forms/NumberInput",
    component: NumberInput,
    args: {
        ...numberInputStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...numberInputStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => {
        const [value, setValue] = useState(args.value);

        useEffect(() => setValue(args.value), [args.value]);

        return (
            <div style={{ width: 240 }}>
                <NumberInput {...args} value={value} onChange={setValue} />
            </div>
        );
    },
};

makeLiveEditStory(Playground, {
    availableImports: { react: React, "@web-ui": { NumberInput } },
    code: `import { useEffect, useState } from 'react';
import { NumberInput } from '@web-ui';

export default function EditableNumberInput(props) {
    const [value, setValue] = useState(props.value);

    useEffect(() => setValue(props.value), [props.value]);

    return <NumberInput {...props} value={value} onChange={setValue} />;
}`,
    modifyEditor: (monaco) => monaco.editor.setTheme("vs-dark"),
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
        ariaLabel: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, variant, size }) => (
                <GalleryNumberInput
                    {...args}
                    color={color}
                    highlightColor={args.highlightColor}
                    variant={variant}
                    size={size}
                    ariaLabel={`${color} ${variant} ${size}`}
                />
            )}
        />
    ),
};
