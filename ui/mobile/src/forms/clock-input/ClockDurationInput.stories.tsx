import { useState } from "react";
import {
    appearanceColorOptions,
    ClockDurationInputProps,
    clockDurationStoryArgs,
    clockDurationStoryControls,
    fillVariantOptions,
} from "@ui";
import { ClockDurationInput } from "./ClockDurationInput";
import { MobileStoryDefinition } from "../../storybook/model";
import { VariantGallery } from "../../storybook/VariantGallery";

const StoryClock = (args: ClockDurationInputProps) => {
    const [value, setValue] = useState(args.value);
    return <ClockDurationInput {...args} value={value} onChange={setValue} />;
};

const story: MobileStoryDefinition<ClockDurationInputProps> = {
    args: clockDurationStoryArgs,
    controls: clockDurationStoryControls,
    galleryEditableControls: [
        "value",
        "min",
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
        "ariaLabel",
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
                />
            )}
        />
    ),
};
export default story;
