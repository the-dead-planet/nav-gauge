import { ComponentProps, useEffect, useState } from "react";
import {
    appearanceColorOptions,
    colorInputStoryArgs,
    colorInputStoryControls,
    fillVariantOptions,
} from "@ui";
import { ColorInput } from "./ColorInput";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const InteractiveColorInput = (args: ComponentProps<typeof ColorInput>) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <ColorInput {...args} value={value} onChange={setValue} />;
};

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
    renderPlayground: (args) => <InteractiveColorInput {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <InteractiveColorInput
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                />
            )}
        />
    ),
};

export default story;
