import { ColorFormat } from "../../design-system/colors";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    allColorShades,
    appearanceColorOptions,
    fillVariantOptions,
    sizeOptions,
} from "../../design-system";
import { StoryControls } from "../../storybook";
import { ColorInputProps } from "./model";

export const colorFormatOptions: { value: ColorFormat; label: string }[] = [
    {
        value: "hex",
        label: "HEX",
    },
    {
        value: "rgb",
        label: "RGB",
    },
    {
        value: "rgba",
        label: "RGBA",
    },
    {
        value: "hsl",
        label: "HSL",
    },
    {
        value: "hsla",
        label: "HSLA",
    },
];

export const colorInputStoryArgs: Omit<ColorInputProps, "onChange"> = {
    label: "Color",
    value: "rgba(51, 102, 153, 0.8)",
    color: DEFAULT_COLOR,
    highlightColor: undefined,
    glyphsShade: undefined,
    highlightGlyphsShade: undefined,
    size: DEFAULT_SIZE,
    variant: DEFAULT_FILL_VARIANT,
    disabled: false,
    highlighted: false,
    showColorButton: true,
    showValueInput: true,
    showFormatSelect: false,
};

export const colorInputStoryControls: StoryControls<ColorInputProps> = {
    value: {
        control: "text",
    },
    label: {
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
    color: {
        control: "select",
        options: appearanceColorOptions,
    },
    highlightColor: {
        control: "select",
        options: ["Default", ...appearanceColorOptions],
        mapping: {
            Default: undefined,
        },
    },
    glyphsShade: {
        control: "select",
        options: ["Default", ...allColorShades],
        mapping: {
            Default: undefined,
        },
    },
    highlightGlyphsShade: {
        control: "select",
        options: ["Default", ...allColorShades],
        mapping: {
            Default: undefined,
        },
    },
    disabled: {
        control: "boolean",
    },
    highlighted: {
        control: "boolean",
    },
    showColorButton: {
        control: "boolean",
    },
    showValueInput: {
        control: "boolean",
    },
    showFormatSelect: {
        control: "boolean",
    },
};
