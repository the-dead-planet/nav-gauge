import { ComponentProps, useEffect, useState } from "react";
import {
    DEFAULT_COLOR,
    saturationValueRampStoryArgs,
    saturationValueRampStoryControls,
} from "@ui";
import { SaturationValueRamp } from "./SaturationValueRamp";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

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

const story: MobileStoryDefinition<ComponentProps<typeof SaturationValueRamp>> =
    {
        args: {
            ...saturationValueRampStoryArgs,
            onChange: () => {},
        },
        controls: saturationValueRampStoryControls,
        galleryEditableControls: [
            "label",
            "hue",
            "saturation",
            "brightness",
            "disabled",
        ],
        renderPlayground: (args) => (
            <InteractiveSaturationValueRamp {...args} />
        ),
        renderGallery: (args) => (
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

export default story;
