import {
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    fillVariantOptions,
    sizeOptions,
} from "../../design-system";
import { StoryControls } from "../../storybook";
import { ColorPickerProps } from "./model";
import {
    getThemeColorSwatches,
    parseColor,
    toCssColor,
} from "../../design-system/colors";
import { Theme } from "../../design-system/theme";

export const getColorPickerSwatches = (theme: Theme, value: string) => {
    const currentColor = parseColor(value);
    const currentValue = toCssColor(currentColor);
    return getThemeColorSwatches(theme).map((swatch) => {
        const value = toCssColor({
            ...parseColor(swatch.color),
            a: currentColor.a,
        });
        return {
            ...swatch,
            value,
            selected: value === currentValue,
        };
    });
};

export const colorPickerStoryArgs: Omit<ColorPickerProps, "onChange"> = {
    label: "Color",
    opacityLabel: "Opacity",
    value: "rgba(51, 102, 153, 0.8)",
    size: DEFAULT_SIZE,
    variant: DEFAULT_FILL_VARIANT,
    disabled: false,
};

export const colorPickerStoryControls: StoryControls<ColorPickerProps> = {
    value: {
        control: "text",
    },
    label: {
        control: "text",
    },
    opacityLabel: {
        control: "text",
    },
    size: {
        control: "select",
        options: sizeOptions,
    },
    variant: {
        control: "select",
        options: fillVariantOptions,
    },
    disabled: {
        control: "boolean",
    },
};
