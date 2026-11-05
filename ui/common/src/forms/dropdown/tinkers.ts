import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    fillVariantOptions,
} from "../../design-system";
import { buttonStoryControls } from "../../gizmos/button";
import { StoryControls } from "../../storybook";
import { DropdownProps } from "./model";

export const dropdownStoryArgs: Omit<DropdownProps<string>, "options"> = {
    value: "brass",
    color: DEFAULT_COLOR,
    variant: DEFAULT_FILL_VARIANT,
    size: DEFAULT_SIZE,
    highlighted: false,
    disabled: false,
    placeholder: "Select material...",
};

export const dropdownStoryControls: StoryControls<DropdownProps<string>> = {
    color: buttonStoryControls.color,
    highlightColor: buttonStoryControls.highlightColor,
    glyphsShade: buttonStoryControls.glyphsShade,
    highlightGlyphsShade: buttonStoryControls.highlightGlyphsShade,
    size: buttonStoryControls.size,
    variant: {
        control: "select",
        options: fillVariantOptions,
    },
    highlighted: buttonStoryControls.highlighted,
    disabled: buttonStoryControls.disabled,
    value: {
        control: "text",
    },
    placeholder: {
        control: "text",
    },
};
