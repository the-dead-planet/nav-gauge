import { ComponentProps, useEffect, useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { OpacityRamp } from "./OpacityRamp";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    opacityRampStoryArgs,
    opacityRampStoryControls,
    useTheme,
} from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";

const InteractiveOpacityRamp = (args: ComponentProps<typeof OpacityRamp>) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <OpacityRamp {...args} value={value} onChange={setValue} />;
};

const meta = {
    title: "Forms/ColorRampOpacity",
    component: OpacityRamp,
    args: {
        ...opacityRampStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...opacityRampStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof OpacityRamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => <InteractiveOpacityRamp {...args} />,
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { OpacityRamp } },
    code: `import { useEffect, useState } from 'react';
import { OpacityRamp } from '@web-ui';

export default function Example(args) {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <OpacityRamp {...args} value={value} onChange={setValue} />;
}`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
    },
    render: (args) => {
        const theme = useTheme();
        return (
            <VariantGallery
                size={args.size}
                colors={appearanceColorOptions}
                variants={["default"]}
                render={({ color, size }) => (
                    <InteractiveOpacityRamp
                        {...args}
                        color={theme.color(color)}
                        size={size}
                    />
                )}
            />
        );
    },
};
