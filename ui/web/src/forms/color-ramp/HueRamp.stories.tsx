import { ComponentProps, useEffect, useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { HueRamp } from "./HueRamp";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { DEFAULT_COLOR, hueRampStoryArgs, hueRampStoryControls } from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";

const InteractiveHueRamp = (args: ComponentProps<typeof HueRamp>) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <HueRamp {...args} value={value} onChange={setValue} />;
};

const meta = {
    title: "Forms/ColorRampHue",
    component: HueRamp,
    args: {
        ...hueRampStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...hueRampStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof HueRamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => <InteractiveHueRamp {...args} />,
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { HueRamp } },
    code: `import { useEffect, useState } from 'react';
import { HueRamp } from '@web-ui';

export default function Example(args) {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <HueRamp {...args} value={value} onChange={setValue} />;
}`,
});

export const Gallery: Story = {
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={[DEFAULT_COLOR]}
            variants={["default"]}
            render={({ size }) => <InteractiveHueRamp {...args} size={size} />}
        />
    ),
};
