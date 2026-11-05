import { useEffect, useRef } from "react";
import { addDecimalStep } from "../number-input";
import {
    DEFAULT_COLOR,
    DEFAULT_SURFACE_VARIANT,
    DEFAULT_SIZE,
    surfaceVariantOptions,
} from "../../design-system";
import { StoryControl, StoryControls } from "../../storybook";
import { numberInputStoryControls } from "../number-input";
import { StepControlsProps } from "./model";

export const stepControlsStoryArgs: Omit<
    StepControlsProps,
    "children" | "onChange"
> = {
    value: 5,
    min: 0,
    max: 10,
    step: 1,
    color: DEFAULT_COLOR,
    variant: DEFAULT_SURFACE_VARIANT,
    size: DEFAULT_SIZE,
    highlightColor: undefined,
    glyphsShade: undefined,
    highlightGlyphsShade: undefined,
    highlighted: false,
    disabled: false,
    ariaLabel: "Value",
};

export const stepControlsStoryControls: StoryControls<StepControlsProps> = {
    variant: {
        control: "select",
        options: surfaceVariantOptions,
    },
    color: numberInputStoryControls.color,
    highlightColor: numberInputStoryControls.highlightColor,
    glyphsShade: numberInputStoryControls.glyphsShade,
    highlightGlyphsShade: numberInputStoryControls.highlightGlyphsShade,
    size: numberInputStoryControls.size,
    value: numberInputStoryControls.value,
    min: numberInputStoryControls.min,
    max: numberInputStoryControls.max,
    step: numberInputStoryControls.step,
    disabled: numberInputStoryControls.disabled,
    highlighted: numberInputStoryControls.highlighted,
    ariaLabel: numberInputStoryControls.ariaLabel,
};

export const stepControlsPropsStoryControl: StoryControl = {
    name: "Step controls variant",
    control: "select",
    options: ["Default", ...surfaceVariantOptions],
    mapping: {
        Default: undefined,
        ...Object.fromEntries(
            surfaceVariantOptions.map((variant) => [variant, { variant }]),
        ),
    },
};

const REPEAT_DELAY_MILLISECONDS = 400;
const REPEAT_INTERVAL_MILLISECONDS = 80;

export interface StepRepeatOptions {
    value: number;
    onChange?: (value: number) => void;
    step?: number;
    min?: number;
    max?: number;
    disabled?: boolean;
}

export const useStepRepeat = ({
    value,
    onChange,
    step = 1,
    min,
    max,
    disabled = false,
}: StepRepeatOptions) => {
    const valueRef = useRef(value);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const optionsRef = useRef({ onChange, step, min, max, disabled });
    valueRef.current = value;
    optionsRef.current = { onChange, step, min, max, disabled };
    const canChange = onChange !== undefined;

    const stop = () => {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
    };

    const changeBy = (direction: -1 | 1) => {
        const { onChange, step, min, max, disabled } = optionsRef.current;
        if (disabled || !onChange) {
            stop();
            return false;
        }

        const nextValue = addDecimalStep(valueRef.current, direction * step);
        if (
            (min !== undefined && nextValue < min) ||
            (max !== undefined && nextValue > max)
        ) {
            stop();
            return false;
        }

        valueRef.current = nextValue;
        onChange(nextValue);
        return true;
    };

    const start = (direction: -1 | 1) => {
        stop();
        if (!changeBy(direction)) {
            return;
        }
        const repeat = () => {
            if (changeBy(direction)) {
                timerRef.current = setTimeout(
                    repeat,
                    REPEAT_INTERVAL_MILLISECONDS,
                );
            }
        };
        timerRef.current = setTimeout(repeat, REPEAT_DELAY_MILLISECONDS);
    };

    useEffect(() => {
        if (disabled || !canChange) {
            clearTimeout(timerRef.current);
        }
        return () => {
            clearTimeout(timerRef.current);
        };
    }, [disabled, canChange]);

    return { changeBy, start, stop };
};
