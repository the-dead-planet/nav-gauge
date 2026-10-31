import {
    allColorShades,
    appearanceColorOptions,
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    fillVariantOptions,
    sizeOptions,
    typographyStoryControls,
} from "../../design-system";
import { StoryControls } from "../../storybook";
import { ClockInputProps, ClockDurationInputProps, ClockMode } from "./model";
import { STEP_DEG } from "./math";

export const MINUTES_HAND_FRACTION = 0.55;

export const CLOCK_SIZE_MULTIPLIER = 2;

export function getClockGeometry(controlHeight: number, mode: ClockMode) {
    const svgSize = controlHeight * CLOCK_SIZE_MULTIPLIER;
    const strokeWidth = svgSize / 60;
    return {
        svgSize,
        center: svgSize / 2,
        outerRadius: svgSize * (mode === "slice" ? 13 / 30 : 2 / 5),
        strokeWidth,
        centerDotRadius: strokeWidth,
        thumbRadius: strokeWidth * 2,
    };
}

export const clockStoryArgs: Omit<ClockInputProps, "onChange"> = {
    value: 45,
    min: 0,
    max: 360,
    step: STEP_DEG,
    color: DEFAULT_COLOR,
    variant: DEFAULT_FILL_VARIANT,
    size: DEFAULT_SIZE,
    themeMode: undefined,
    glyphsShade: undefined,
    highlightColor: undefined,
    highlightGlyphsShade: undefined,
    highlighted: false,
    disabled: false,
    showNumberInput: false,
    showStepControls: false,
    numberInputPlacement: "end",
    label: "Angle",
};

export const clockSliceStoryArgs: Omit<ClockInputProps, "onChange"> = {
    ...clockStoryArgs,
    value: 30,
    max: 85,
    step: 1,
};

export const clockDurationStoryArgs: Omit<ClockDurationInputProps, "onChange"> =
    {
        value: 15000,
        min: 0,
        step: 1000,
        color: DEFAULT_COLOR,
        variant: DEFAULT_FILL_VARIANT,
        size: DEFAULT_SIZE,
        themeMode: undefined,
        glyphsShade: undefined,
        highlightColor: undefined,
        highlightGlyphsShade: undefined,
        highlighted: false,
        disabled: false,
        showNumberInput: false,
        showStepControls: false,
        numberInputPlacement: "end",
        ariaLabel: "Duration",
    };

export const clockDurationStoryControls: StoryControls<ClockDurationInputProps> =
    {
        value: { control: { type: "number" } },
        min: { control: { type: "number" } },
        step: { control: { type: "number" } },
        themeMode: typographyStoryControls.themeMode,
        color: {
            control: "select",
            options: appearanceColorOptions,
        },
        variant: {
            control: "select",
            options: fillVariantOptions,
        },
        size: {
            control: "select",
            options: sizeOptions,
        },
        glyphsShade: {
            control: "select",
            options: ["Default", ...allColorShades],
            mapping: { Default: undefined },
        },
        highlightColor: {
            control: "select",
            options: ["Default", ...appearanceColorOptions],
            mapping: { Default: undefined },
        },
        highlightGlyphsShade: {
            control: "select",
            options: ["Default", ...allColorShades],
            mapping: { Default: undefined },
        },
        highlighted: { control: "boolean" },
        disabled: { control: "boolean" },
        showNumberInput: { control: "boolean" },
        showStepControls: { control: "boolean" },
        numberInputPlacement: {
            control: "select",
            options: ["start", "end", "above", "below"],
        },
        ariaLabel: { control: "text" },
    };

export const clockStoryControls: StoryControls<ClockInputProps> = {
    ...clockDurationStoryControls,
    max: { control: { type: "number" } },
    label: { control: "text" },
};
