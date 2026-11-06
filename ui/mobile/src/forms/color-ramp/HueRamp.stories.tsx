import { ComponentProps, useEffect, useState } from "react";
import { DEFAULT_COLOR, hueRampStoryArgs, hueRampStoryControls } from "@ui";
import { HueRamp } from "./HueRamp";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const InteractiveHueRamp = (args: ComponentProps<typeof HueRamp>) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <HueRamp {...args} value={value} onChange={setValue} />;
};

const story: MobileStoryDefinition<ComponentProps<typeof HueRamp>> = {
    args: {
        ...hueRampStoryArgs,
        onChange: () => {},
    },
    controls: hueRampStoryControls,
    galleryEditableControls: ["label", "value", "disabled"],
    renderPlayground: (args) => <InteractiveHueRamp {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            size={args.size}
            colors={[DEFAULT_COLOR]}
            variants={["default"]}
            render={({ size }) => <InteractiveHueRamp {...args} size={size} />}
        />
    ),
};

export default story;
