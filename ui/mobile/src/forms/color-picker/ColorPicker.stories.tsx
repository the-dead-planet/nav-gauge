import { ComponentProps } from "react";
import {
    DEFAULT_COLOR,
    colorPickerStoryArgs,
    colorPickerStoryControls,
    fillVariantOptions,
} from "@ui";
import { ColorPicker } from "./ColorPicker";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const story: MobileStoryDefinition<ComponentProps<typeof ColorPicker>> = {
    args: {
        ...colorPickerStoryArgs,
        onChange: () => {},
    },
    controls: colorPickerStoryControls,
    galleryEditableControls: ["value", "label", "opacityLabel", "disabled"],
    renderPlayground: (args, updateArgs) => (
        <ColorPicker {...args} onChange={(value) => updateArgs({ value })} />
    ),
    renderGallery: (args, updateArgs) => (
        <VariantGallery
            colors={[DEFAULT_COLOR]}
            variants={fillVariantOptions}
            render={({ size, variant }) => (
                <ColorPicker
                    {...args}
                    size={size}
                    variant={variant}
                    onChange={(value) => updateArgs({ value })}
                />
            )}
        />
    ),
};

export default story;
