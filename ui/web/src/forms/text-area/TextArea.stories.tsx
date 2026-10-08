import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import * as React from "react";
import { ComponentProps, useState } from "react";
import { TextArea } from "./TextArea";
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

const GalleryTextArea = (props: ComponentProps<typeof TextArea>) => {
    const [value, setValue] = useState(props.value);

    return (
        <TextArea
            {...props}
            value={value}
            onChange={(event) => setValue(event.target.value)}
        />
    );
};

const meta = {
    title: "Forms/TextArea",
    component: TextArea,
    args: {
        id: "text-area-playground",
        label: "Label",
        value: "Some text",
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
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => {
        const [value, setValue] = useState(args.value);

        return (
            <div style={{ maxWidth: 320 }}>
                <TextArea
                    {...args}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
            </div>
        );
    },
};

makeLiveEditStory(Playground, {
    availableImports: { react: React, "@web-ui": { TextArea } },
    code: `import { useState } from 'react';
import { TextArea } from '@web-ui';

export default function EditableTextArea(props) {
    const [value, setValue] = useState(props.value);

    return (
        <TextArea
            {...props}
            value={value}
            onChange={(event) => setValue(event.target.value)}
        />
    );
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
                <GalleryTextArea
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
