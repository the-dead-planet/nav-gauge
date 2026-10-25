import {
    activeGlowOptions,
    appearanceColorOptions,
    DEFAULT_FILL_VARIANT,
    DEFAULT_COLOR,
    fillVariantOptions,
} from "../design-system/tinkers";
import { PanelProps } from "./panel/model";
import { StoryControls } from "../storybook/model";

export const hudSurfaceStoryArgs: Pick<
    PanelProps,
    | "children"
    | "color"
    | "variant"
    | "interactive"
    | "highlighted"
    | "disabled"
    | "activeGlow"
> = {
    children: "Preview",
    color: DEFAULT_COLOR,
    variant: DEFAULT_FILL_VARIANT,
    interactive: false,
    highlighted: false,
    disabled: false,
    activeGlow: "none",
};

export const hudSurfaceStoryControls: StoryControls<PanelProps> = {
    children: {
        control: "text",
    },
    color: {
        control: "select",
        options: appearanceColorOptions,
    },
    highlightColor: {
        control: "select",
        options: [undefined, ...appearanceColorOptions],
    },
    variant: {
        control: "select",
        options: fillVariantOptions,
    },
    interactive: {
        control: "boolean",
    },
    highlighted: {
        control: "boolean",
    },
    disabled: {
        control: "boolean",
    },
    activeGlow: {
        control: "select",
        options: activeGlowOptions,
    },
};
