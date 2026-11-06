import { ComponentProps, useEffect, useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    colorRampStoryArgs,
    colorRampStoryControls,
    useTheme,
} from "@ui";
import { ColorRamp } from "./ColorRamp";
import { VariantGallery } from "../../storybook/VariantGallery";

const InteractiveColorRamp = (args: ComponentProps<typeof ColorRamp>) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <ColorRamp {...args} value={value} onChange={setValue} />;
};

const meta = {
    title: "Forms/ColorRamp",
    component: ColorRamp,
    args: {
        ...colorRampStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...colorRampStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof ColorRamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => <InteractiveColorRamp {...args} />,
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { ColorRamp } },
    code: `import { useEffect, useState } from 'react';
import { ColorRamp } from '@web-ui';

export default function Example(args) {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <ColorRamp {...args} value={value} onChange={setValue} />;
}`,
});

export const Gallery: Story = {
    argTypes: {
        value: { table: { disable: true } },
    },
    render: (args) => {
        const theme = useTheme();
        return (
            <VariantGallery
                size={args.size}
                colors={appearanceColorOptions}
                variants={["default"]}
                render={({ color, size }) => (
                    <InteractiveColorRamp
                        {...args}
                        value={theme.color(color)}
                        size={size}
                    />
                )}
            />
        );
    },
};
