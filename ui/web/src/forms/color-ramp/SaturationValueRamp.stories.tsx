import { ComponentProps, useEffect, useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { SaturationValueRamp } from "./SaturationValueRamp";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    DEFAULT_COLOR,
    saturationValueRampStoryArgs,
    saturationValueRampStoryControls,
} from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";

const InteractiveSaturationValueRamp = (
    args: ComponentProps<typeof SaturationValueRamp>,
) => {
    const [saturation, setSaturation] = useState(args.saturation);
    const [brightness, setBrightness] = useState(args.brightness);
    useEffect(() => setSaturation(args.saturation), [args.saturation]);
    useEffect(() => setBrightness(args.brightness), [args.brightness]);
    return (
        <SaturationValueRamp
            {...args}
            saturation={saturation}
            brightness={brightness}
            onChange={(nextSaturation, nextBrightness) => {
                setSaturation(nextSaturation);
                setBrightness(nextBrightness);
            }}
        />
    );
};

const meta = {
    title: "Forms/ColorRampSaturation",
    component: SaturationValueRamp,
    args: {
        ...saturationValueRampStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...saturationValueRampStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof SaturationValueRamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => <InteractiveSaturationValueRamp {...args} />,
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { SaturationValueRamp } },
    code: `import { useEffect, useState } from 'react';
import { SaturationValueRamp } from '@web-ui';

export default function Example(args) {
    const [position, setPosition] = useState([args.saturation, args.brightness]);
    useEffect(() => setPosition([args.saturation, args.brightness]), [args.saturation, args.brightness]);
    return <SaturationValueRamp {...args} saturation={position[0]} brightness={position[1]} onChange={(saturation, brightness) => setPosition([saturation, brightness])} />;
}`,
});

export const Gallery: Story = {
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={[DEFAULT_COLOR]}
            variants={["default"]}
            render={({ size }) => (
                <InteractiveSaturationValueRamp {...args} size={size} />
            )}
        />
    ),
};
