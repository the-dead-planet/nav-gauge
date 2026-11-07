import { ComponentProps } from "react";
import {
    appearanceColorOptions,
    colorInputStoryArgs,
    colorInputStoryControls,
    fillVariantOptions,
} from "@ui";
import { ColorInput } from "./ColorInput";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const story: MobileStoryDefinition<ComponentProps<typeof ColorInput>> = {
    args: {
        ...colorInputStoryArgs,
        onChange: () => {},
    },
    controls: colorInputStoryControls,
    galleryEditableControls: [
        "label",
        "value",
        "highlightColor",
        "glyphsShade",
        "highlightGlyphsShade",
        "highlighted",
        "disabled",
        "showColorButton",
        "showValueInput",
        "showFormatSelect",
    ],
    renderPlayground: (args, updateArgs) => (
        <ColorInput {...args} onChange={(value) => updateArgs({ value })} />
    ),
    renderGallery: (args, updateArgs) => (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <ColorInput
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                    onChange={(value) => updateArgs({ value })}
                />
            )}
        />
    ),
};

export default story;
