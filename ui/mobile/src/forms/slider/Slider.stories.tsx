import { ComponentProps, useState } from "react";
import {
    appearanceColorOptions,
    fillVariantOptions,
    sliderStoryArgs,
    sliderStoryControls,
} from "@ui";
import { Slider } from "./Slider";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const StorySlider = (args: ComponentProps<typeof Slider>) => {
    const [value, setValue] = useState(args.value);
    const [previousValue, setPreviousValue] = useState(args.value);
    if (previousValue !== args.value) {
        setPreviousValue(args.value);
        setValue(args.value);
    }
    return <Slider {...args} value={value} onChange={setValue} />;
};

const story: MobileStoryDefinition<ComponentProps<typeof Slider>> = {
    args: sliderStoryArgs,
    controls: sliderStoryControls,
    galleryEditableControls: [
        "themeMode",
        "value",
        "min",
        "max",
        "step",
        "label",
        "highlightColor",
        "glyphsShade",
        "highlightGlyphsShade",
        "highlighted",
        "disabled",
        "showNumberInput",
        "showStepControls",
    ],
    renderPlayground: (args) => <StorySlider {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <StorySlider
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
