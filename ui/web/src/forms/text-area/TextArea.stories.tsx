import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { ComponentProps, useState } from "react";
import { TextArea } from "./TextArea";
import { ColorVariant, SizeVariant, FillVariant } from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";

const allSizes: SizeVariant[] = ["md", "sm", "xs"];
const allColors: ColorVariant[] = [
    "neutral",
    "primary",
    "secondary",
    "tertiary",
];
const allVariants: FillVariant[] = ["fill", "fill-inverse", "fill-translucent"];

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
        color: { control: "select", options: allColors },
        highlightColor: { control: "select", options: allColors },
        size: { control: "select", options: allSizes },
        variant: { control: "select", options: allVariants },
        disabled: { control: "boolean" },
        autoSelect: { control: "boolean" },
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
    availableImports: { react: { useState }, "@web-ui": { TextArea } },
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
            sizes={allSizes}
            colors={allColors}
            variants={allVariants}
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
