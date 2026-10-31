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
import { TextInputProps } from "./model";

export const textInputStoryArgs: Omit<TextInputProps, "onChange"> = {
    themeMode: undefined,
    label: "Label",
    placeholder: "Placeholder",
    value: "Hello",
    color: DEFAULT_COLOR,
    glyphsShade: undefined,
    highlightColor: undefined,
    highlightGlyphsShade: undefined,
    size: DEFAULT_SIZE,
    variant: DEFAULT_FILL_VARIANT,
    autoSelect: false,
    highlighted: false,
    disabled: false,
};

export const textInputStoryControls: StoryControls<TextInputProps> = {
    themeMode: typographyStoryControls.themeMode,
    label: {
        control: "text",
    },
    placeholder: {
        control: "text",
    },
    value: {
        control: "text",
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
    highlighted: {
        control: "boolean",
    },
    disabled: {
        control: "boolean",
    },
};
