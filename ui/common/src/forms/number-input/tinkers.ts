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
import { NumberInputProps } from "./model";

export const numberInputStoryArgs: Omit<NumberInputProps, "onChange"> = {
    themeMode: undefined,
    label: "Value",
    value: 42,
    min: 0,
    max: 100,
    step: 1,
    color: DEFAULT_COLOR,
    glyphsShade: undefined,
    highlightColor: undefined,
    highlightGlyphsShade: undefined,
    size: DEFAULT_SIZE,
    variant: DEFAULT_FILL_VARIANT,
    autoSelect: false,
    ariaLabel: undefined,
    unit: "px",
    showStepControls: true,
    highlighted: false,
    disabled: false,
};

export const numberInputStoryControls: StoryControls<NumberInputProps> = {
    themeMode: typographyStoryControls.themeMode,
    label: {
        control: "text",
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
    color: {
        control: "select",
        options: appearanceColorOptions,
    },
    glyphsShade: {
        control: "select",
        options: ["Default", ...allColorShades],
        mapping: {
            Default: undefined,
        },
    },
    highlightColor: {
        control: "select",
        options: ["Default", ...appearanceColorOptions],
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
    size: {
        control: "select",
        options: sizeOptions,
    },
    variant: {
        control: "select",
        options: fillVariantOptions,
    },
    autoSelect: {
        control: "boolean",
    },
    ariaLabel: {
        control: "text",
    },
    unit: {
        control: "text",
    },
    showStepControls: {
        control: "boolean",
    },
    highlighted: {
        control: "boolean",
    },
    disabled: {
        control: "boolean",
    },
};
