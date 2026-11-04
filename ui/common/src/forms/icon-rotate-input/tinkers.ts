import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    surfaceVariantOptions,
} from "../../design-system";
import { StoryControls } from "../../storybook";
import { numberInputStoryControls } from "../number-input";
import { stepControlsPropsStoryControl } from "../step-controls";
import { IconRotateInputProps } from "./model";

export const snapRotation = (
    value: number,
    min: number,
    max: number,
    step: number,
): number => {
    const stepped = Math.round((value - min) / step) * step + min;
    return max - min >= 360
        ? ((((stepped - min) % 360) + 360) % 360) + min
        : Math.min(max, Math.max(min, stepped));
};

export const iconRotateInputStoryArgs: Omit<IconRotateInputProps, "onChange"> =
    {
        value: 45,
        valueAdjustment: 0,
        color: DEFAULT_COLOR,
        variant: DEFAULT_SURFACE_VARIANT,
        highlightColor: undefined,
        themeMode: undefined,
        glyphsShade: undefined,
        highlightGlyphsShade: undefined,
        highlighted: false,
        size: DEFAULT_SIZE,
        min: 0,
        max: 360,
        step: 1,
        disabled: false,
        label: "Rotation",
        showNumberInput: false,
        showStepControls: false,
        stepControlsProps: undefined,
        numberInputPlacement: "end",
        ariaLabel: undefined,
    };

export const iconRotateInputStoryControls: StoryControls<IconRotateInputProps> =
    {
        themeMode: numberInputStoryControls.themeMode,
        color: numberInputStoryControls.color,
        variant: {
            control: "select",
            options: surfaceVariantOptions,
        },
        highlightColor: numberInputStoryControls.highlightColor,
        glyphsShade: numberInputStoryControls.glyphsShade,
        highlightGlyphsShade: numberInputStoryControls.highlightGlyphsShade,
        size: numberInputStoryControls.size,
        value: numberInputStoryControls.value,
        min: numberInputStoryControls.min,
        max: numberInputStoryControls.max,
        step: numberInputStoryControls.step,
        label: numberInputStoryControls.label,
        disabled: numberInputStoryControls.disabled,
        highlighted: numberInputStoryControls.highlighted,
        ariaLabel: numberInputStoryControls.ariaLabel,
        valueAdjustment: { control: { type: "number" } },
        showNumberInput: { control: "boolean" },
        showStepControls: { control: "boolean" },
        stepControlsProps: stepControlsPropsStoryControl,
        numberInputPlacement: {
            control: "select",
            options: ["start", "end", "above", "below"],
        },
    };
