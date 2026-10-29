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
import { CheckboxProps } from "./model";

export const checkboxStoryArgs: Omit<CheckboxProps, "onChange"> = {
    themeMode: undefined,
    children: "Checkbox",
    checked: false,
    color: DEFAULT_COLOR,
    variant: DEFAULT_FILL_VARIANT,
    size: DEFAULT_SIZE,
    glyphsShade: undefined,
    highlightColor: undefined,
    highlightGlyphsShade: undefined,
    highlighted: false,
    disabled: false,
};

export const checkboxStoryControls: StoryControls<CheckboxProps> = {
    themeMode: typographyStoryControls.themeMode,
    children: {
        control: "text",
    },
    checked: {
        control: "boolean",
    },
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
    highlighted: {
        control: "boolean",
    },
    disabled: {
        control: "boolean",
    },
};
