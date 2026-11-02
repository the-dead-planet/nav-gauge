import {
    appearanceColorOptions,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    sizeOptions,
    surfaceVariantOptions,
    typographyStoryControls,
} from "../../design-system";
import { StoryControls } from "../../storybook";
import { FieldsetProps } from "./model";

export const fieldsetStoryArgs: FieldsetProps = {
    label: "Fieldset",
    children: "Fieldset content",
    themeMode: undefined,
    color: DEFAULT_COLOR,
    highlightColor: undefined,
    variant: DEFAULT_SURFACE_VARIANT,
    size: DEFAULT_SIZE,
    highlighted: false,
    disabled: false,
    expandable: true,
    expanded: undefined,
};

export const fieldsetStoryControls: StoryControls<FieldsetProps> = {
    themeMode: typographyStoryControls.themeMode,
    label: {
        control: "text",
    },
    children: {
        control: "text",
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
    variant: {
        control: "select",
        options: surfaceVariantOptions,
    },
    size: {
        control: "select",
        options: sizeOptions,
    },
    highlighted: {
        control: "boolean",
    },
    disabled: {
        control: "boolean",
    },
    expandable: {
        control: "boolean",
    },
    expanded: {
        control: "select",
        options: ["Uncontrolled", "Expanded", "Collapsed"],
        mapping: {
            Uncontrolled: undefined,
            Expanded: true,
            Collapsed: false,
        },
    },
};
