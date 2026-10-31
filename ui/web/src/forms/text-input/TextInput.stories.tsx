import * as React from "react";
import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    fillVariantOptions,
    textInputStoryArgs,
    textInputStoryControls,
    TextInputProps,
} from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";
import { TextInput } from "./TextInput";

const GalleryTextInput = (props: TextInputProps) => {
    const [value, setValue] = useState(props.value);

    useEffect(() => setValue(props.value), [props.value]);

    return <TextInput {...props} value={value} onChange={setValue} />;
};

const meta = {
    title: "Forms/TextInput",
    component: TextInput,
    args: {
        ...textInputStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...textInputStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => {
        const [value, setValue] = useState(args.value);

        useEffect(() => setValue(args.value), [args.value]);

        return (
            <div style={{ width: 320 }}>
                <TextInput {...args} value={value} onChange={setValue} />
            </div>
        );
    },
};

makeLiveEditStory(Playground, {
    availableImports: { react: React, "@web-ui": { TextInput } },
    code: `import { useEffect, useState } from 'react';
import { TextInput } from '@web-ui';

export default function EditableTextInput(props) {
    const [value, setValue] = useState(props.value);

    useEffect(() => setValue(props.value), [props.value]);

    return <TextInput {...props} value={value} onChange={setValue} />;
}`,
    modifyEditor: (monaco) => monaco.editor.setTheme("vs-dark"),
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
            render={({ color, variant, size }) => (
                <GalleryTextInput
                    {...args}
                    color={color}
                    highlightColor={args.highlightColor}
                    variant={variant}
                    size={size}
                />
            )}
        />
    ),
};
