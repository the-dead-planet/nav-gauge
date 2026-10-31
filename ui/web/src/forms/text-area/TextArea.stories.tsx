import * as React from "react";
import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    fillVariantOptions,
    textAreaStoryArgs,
    textAreaStoryControls,
    TextAreaProps,
} from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";
import { TextArea } from "./TextArea";

const GalleryTextArea = (props: TextAreaProps) => {
    const [value, setValue] = useState(props.value);

    useEffect(() => setValue(props.value), [props.value]);

    return <TextArea {...props} value={value} onChange={setValue} />;
};

const meta = {
    title: "Forms/TextArea",
    component: TextArea,
    args: {
        ...textAreaStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...textAreaStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => {
        const [value, setValue] = useState(args.value);

        useEffect(() => setValue(args.value), [args.value]);

        return (
            <div style={{ width: 320 }}>
                <TextArea {...args} value={value} onChange={setValue} />
            </div>
        );
    },
};

makeLiveEditStory(Playground, {
    availableImports: { react: React, "@web-ui": { TextArea } },
    code: `import { useEffect, useState } from 'react';
import { TextArea } from '@web-ui';

export default function EditableTextArea(props) {
    const [value, setValue] = useState(props.value);

    useEffect(() => setValue(props.value), [props.value]);

    return <TextArea {...props} value={value} onChange={setValue} />;
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
                <GalleryTextArea
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
