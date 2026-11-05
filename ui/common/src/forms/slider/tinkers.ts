import { SliderProps } from "./model";
import {
    allColorShades,
    activeGlowOptions,
    appearanceColorOptions,
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    fillVariantOptions,
    sizeOptions,
} from "../../design-system";
import { StoryControls } from "../../storybook";
import { stepControlsPropsStoryControl } from "../step-controls";

export const getSliderRatio = (
    value: number,
    min: number,
    max: number,
): number =>
    max > min ? Math.max(0, Math.min(1, (value - min) / (max - min))) : 0;

export const snapSliderValue = (
    value: number,
    min: number,
    max: number,
    step: number,
): number => {
    if (max <= min) {
        return min;
    }
    const interval = step > 0 ? step : 1;
    const snapped = Number(
        (min + Math.round((value - min) / interval) * interval).toPrecision(15),
    );
    return Math.max(min, Math.min(max, snapped));
};

export const sliderStoryArgs: SliderProps = {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    label: "Slider",
    color: DEFAULT_COLOR,
    variant: DEFAULT_FILL_VARIANT,
    size: DEFAULT_SIZE,
    activeGlow: "none",
    highlighted: false,
    disabled: false,
    showNumberInput: false,
    showStepControls: false,
    stepControlsProps: undefined,
};

export const sliderStoryControls: StoryControls<SliderProps> = {
    color: {
        control: "select",
        options: appearanceColorOptions,
    },
    highlightColor: {
        control: "select",
        options: ["Default", ...appearanceColorOptions],
        mapping: { Default: undefined },
    },
    glyphsShade: {
        control: "select",
        options: ["Default", ...allColorShades],
        mapping: { Default: undefined },
    },
    highlightGlyphsShade: {
        control: "select",
        options: ["Default", ...allColorShades],
        mapping: { Default: undefined },
    },
    variant: {
        control: "select",
        options: fillVariantOptions,
    },
    size: {
        control: "select",
        options: sizeOptions,
    },
    activeGlow: {
        control: "select",
        options: activeGlowOptions,
    },
    value: {
        control: {
            type: "number",
        },
    },
    min: {
        control: {
            type: "number",
        },
    },
    max: {
        control: {
            type: "number",
        },
    },
    step: {
        control: {
            type: "number",
        },
    },
    label: { control: "text" },
    highlighted: { control: "boolean" },
    disabled: { control: "boolean" },
    showNumberInput: { control: "boolean" },
    showStepControls: { control: "boolean" },
    stepControlsProps: stepControlsPropsStoryControl,
};
