import * as React from "react";
import { ComponentProps, useEffect, useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    fillVariantOptions,
    stepControlsStoryArgs,
    stepControlsStoryControls,
} from "@ui";
import { StepControls } from "./StepControls";
import { Span } from "../../design-system/typography";
import { VariantGallery } from "../../storybook/VariantGallery";

const StoryStepControls = (props: ComponentProps<typeof StepControls>) => {
    const [value, setValue] = useState(props.value);
    useEffect(() => setValue(props.value), [props.value]);
    return (
        <StepControls {...props} value={value} onChange={setValue}>
            <Span tabular>{value}</Span>
        </StepControls>
    );
};

const meta = {
    title: "Forms/StepControls",
    component: StepControls,
    args: {
        ...stepControlsStoryArgs,
        children: "Value",
        onChange: () => {},
    },
    argTypes: {
        ...stepControlsStoryControls,
        children: { control: false },
        onChange: { control: false },
    },
} satisfies Meta<typeof StepControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => <StoryStepControls {...args} />,
};

makeLiveEditStory(Playground, {
    availableImports: { react: React, "@web-ui": { StepControls, Span } },
    code: `import { useEffect, useState } from 'react';
import { StepControls, Span } from '@web-ui';

export default function EditableSteps(props) {
    const [value, setValue] = useState(props.value);
    useEffect(() => setValue(props.value), [props.value]);
    return (
        <StepControls {...props} value={value} onChange={setValue}>
            <Span tabular>{value}</Span>
        </StepControls>
    );
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
            render={({ color, size, variant }) => (
                <StoryStepControls
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                />
            )}
        />
    ),
};
