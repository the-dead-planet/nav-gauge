import { ComponentProps } from "react";
import {
    DEFAULT_COLOR,
    DEFAULT_VARIANT,
    hueRampStoryArgs,
    hueRampStoryControls,
} from "@ui";
import { HueRamp } from "./HueRamp";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const story: MobileStoryDefinition<ComponentProps<typeof HueRamp>> = {
    args: {
        ...hueRampStoryArgs,
        onChange: () => {},
    },
    controls: hueRampStoryControls,
    galleryEditableControls: ["value", "label", "disabled"],
    renderPlayground: (args, updateArgs) => (
        <HueRamp {...args} onChange={(value) => updateArgs({ value })} />
    ),
    renderGallery: (args, updateArgs) => (
        <VariantGallery
            colors={[DEFAULT_COLOR]}
            variants={[DEFAULT_VARIANT]}
            render={({ size }) => (
                <HueRamp
                    {...args}
                    size={size}
                    onChange={(value) => updateArgs({ value })}
                />
            )}
        />
    ),
};

export default story;
