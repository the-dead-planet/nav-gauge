import { ComponentProps } from "react";
import {
    DEFAULT_COLOR,
    DEFAULT_VARIANT,
    colorRampStoryArgs,
    colorRampStoryControls,
} from "@ui";
import { ColorRamp } from "./ColorRamp";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const story: MobileStoryDefinition<ComponentProps<typeof ColorRamp>> = {
    args: {
        ...colorRampStoryArgs,
        onChange: () => {},
    },
    controls: colorRampStoryControls,
    galleryEditableControls: ["value", "label", "opacityLabel", "disabled"],
    renderPlayground: (args, updateArgs) => (
        <ColorRamp {...args} onChange={(value) => updateArgs({ value })} />
    ),
    renderGallery: (args, updateArgs) => (
        <VariantGallery
            colors={[DEFAULT_COLOR]}
            variants={[DEFAULT_VARIANT]}
            render={({ size }) => (
                <ColorRamp
                    {...args}
                    size={size}
                    onChange={(value) => updateArgs({ value })}
                />
            )}
        />
    ),
};

export default story;
