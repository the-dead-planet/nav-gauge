import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import * as React from "react";
import { ComponentProps, useState } from "react";
import { TextInput } from "./TextInput";
import { VariantGallery } from "../../storybook/VariantGallery";
import {
    booleanControl,
    colorControl,
    colorOptions,
    fillVariantControl,
    fillVariantOptions,
    sizeControl,
    sizeOptions,
} from "../../storybook/controls";

const GalleryTextInput = (props: ComponentProps<typeof TextInput>) => {
    const [value, setValue] = useState(props.value);

    return <TextInput {...props} value={value} onChange={setValue} />;
};

const meta = {
    title: "Forms/TextInput",
    component: TextInput,
    args: {
        id: "text-input-playground",
        label: "Label",
        value: "Hello",
        color: "neutral",
        highlightColor: "neutral",
        size: "sm",
        variant: "fill-inverse",
        disabled: false,
        autoSelect: false,
        onChange: () => {},
    },
    argTypes: {
        color: colorControl,
        highlightColor: colorControl,
        size: sizeControl,
        variant: fillVariantControl,
        disabled: booleanControl,
        autoSelect: booleanControl,
        value: { control: false },
        onChange: { control: false },
    },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => {
        const [value, setValue] = useState(args.value);

        return (
            <div style={{ maxWidth: 320 }}>
                <TextInput {...args} value={value} onChange={setValue} />
            </div>
        );
    },
};

makeLiveEditStory(Playground, {
    availableImports: { react: React, "@web-ui": { TextInput } },
    code: `import { useState } from 'react';
import { TextInput } from '@web-ui';

export default function EditableTextInput(props) {
    const [value, setValue] = useState(props.value);

    return <TextInput {...props} value={value} onChange={setValue} />;
}`,
    modifyEditor: (monaco) => monaco.editor.setTheme("vs-dark"),
});

export const Gallery: Story = {
    argTypes: {
        id: { table: { disable: true } },
        color: { table: { disable: true } },
        size: { table: { disable: true } },
        variant: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            sizes={sizeOptions}
            colors={colorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <GalleryTextInput
                    {...args}
                    id={`${color}-${size}-${variant}`}
                    color={color}
                    size={size}
                    variant={variant}
                />
            )}
        />
    ),
};
