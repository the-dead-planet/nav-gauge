import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { ComponentProps, useState } from "react";
import { TextInput } from "./TextInput";
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
        color: { control: "select", options: allColors },
        highlightColor: { control: "select", options: allColors },
        size: { control: "select", options: allSizes },
        variant: { control: "select", options: allVariants },
        disabled: { control: "boolean" },
        autoSelect: { control: "boolean" },
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
    availableImports: { react: { useState }, "@web-ui": { TextInput } },
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
            sizes={allSizes}
            colors={allColors}
            variants={allVariants}
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
