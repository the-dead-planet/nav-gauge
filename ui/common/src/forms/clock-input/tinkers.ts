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
import {
    arcViewBox,
    describeClockWedge,
    millisecondsToDurationParts,
    pointerCoords,
    STEP_DEG,
    ticksToClockDegrees,
} from "./math";

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

export function getClockDrawing(
    controlHeight: number,
    mode: ClockMode,
    value: number,
    min: number,
    max: number,
) {
    const geometry = getClockGeometry(controlHeight, mode);
    const { svgSize, center, outerRadius, strokeWidth } = geometry;
    const duration = mode === "duration";
    const fullCircle = mode !== "slice" || max - min >= 360;
    const viewBox =
        mode === "slice" && !fullCircle
            ? arcViewBox(center, center, outerRadius + strokeWidth, min, max)
            : { x: 0, y: 0, width: svgSize, height: svgSize };
    const { minutes, seconds } = millisecondsToDurationParts(value);
    const hands = duration
        ? [
              pointerCoords(
                  ticksToClockDegrees(minutes),
                  outerRadius * MINUTES_HAND_FRACTION,
              ),
              pointerCoords(ticksToClockDegrees(seconds), outerRadius),
          ]
        : [pointerCoords(value, outerRadius)];

    return {
        ...geometry,
        viewBox,
        hands,
        fullCircle,
        wedge: describeClockWedge(center, outerRadius, min, max),
        min: duration ? 0 : min,
        max: duration ? 360 : max,
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
