import * as React from "react";
import { ComponentProps, useEffect, useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    surfaceVariantOptions,
    Icons,
    iconRotateInputStoryArgs,
    iconRotateInputStoryControls,
} from "@ui";
import { IconRotateInput } from "./IconRotateInput";
import { VariantGallery } from "../../storybook/VariantGallery";

const StoryRotateInput = (props: ComponentProps<typeof IconRotateInput>) => {
    const [value, setValue] = useState(props.value);
    useEffect(() => setValue(props.value), [props.value]);
    return <IconRotateInput {...props} value={value} onChange={setValue} />;
};

const meta = {
    title: "Forms/IconRotateInput",
    component: IconRotateInput,
    args: {
        ...iconRotateInputStoryArgs,
        icon: Icons.NounProject.CameraVideoFront,
        onChange: () => {},
    },
    argTypes: {
        ...iconRotateInputStoryControls,
        icon: {
            control: "select",
            options: ["None", "Camera", "Beaker"],
            mapping: {
                None: undefined,
                Camera: Icons.NounProject.CameraVideoFront,
                Beaker: Icons.Beaker,
            },
        },
        onChange: { control: false },
    },
} satisfies Meta<typeof IconRotateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => <StoryRotateInput {...args} />,
};

makeLiveEditStory(Playground, {
    availableImports: { react: React, "@web-ui": { IconRotateInput } },
    code: `import { useEffect, useState } from 'react';
import { IconRotateInput } from '@web-ui';

export default function EditableRotation(props) {
    const [value, setValue] = useState(props.value);
    useEffect(() => setValue(props.value), [props.value]);
    return <IconRotateInput {...props} value={value} onChange={setValue} />;
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
            variants={surfaceVariantOptions}
            render={({ color, size, variant }) => (
                <StoryRotateInput
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                />
            )}
        />
    ),
};
