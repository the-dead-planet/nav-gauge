import { useState } from "react";
import {
    appearanceColorOptions,
    ClockInputProps,
    clockStoryArgs,
    clockStoryControls,
    fillVariantOptions,
} from "@ui";
import { ClockInput } from "./ClockInput";
import { MobileStoryDefinition } from "../../storybook/model";
import { VariantGallery } from "../../storybook/VariantGallery";

const StoryClock = (args: ClockInputProps) => {
    const [value, setValue] = useState(args.value);
    return <ClockInput {...args} value={value} onChange={setValue} />;
};

const story: MobileStoryDefinition<ClockInputProps> = {
    args: clockStoryArgs,
    controls: clockStoryControls,
    galleryEditableControls: [
        "value",
        "min",
        "max",
        "step",
        "themeMode",
        "glyphsShade",
        "highlightColor",
        "highlightGlyphsShade",
        "highlighted",
        "disabled",
        "showNumberInput",
        "showStepControls",
        "numberInputPlacement",
    ],
    renderPlayground: (args) => <StoryClock key={args.value} {...args} />,
    renderGallery: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, variant, size }) => (
                <StoryClock
                    key={args.value}
                    {...args}
                    color={color}
                    variant={variant}
                    size={size}
                    label={color}
                />
            )}
        />
    ),
};
export default story;
