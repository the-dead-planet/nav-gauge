import { ChipProps } from "./model";
import {
    appearanceColorOptions,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    fillVariantOptions,
    sizeOptions,
    surfaceVariantOptions,
    typographyStoryControls,
} from "../../design-system";
import { StoryControls } from "../../storybook";

export const chipStoryArgs: ChipProps = {
    children: "Chip",
    fontType: undefined,
    color: DEFAULT_COLOR,
    size: DEFAULT_SIZE,
    variant: DEFAULT_SURFACE_VARIANT,
    tooltip: "",
    tooltipVariant: "fill-inverse",
    showTooltipConnection: false,
};

export const chipStoryControls: StoryControls<ChipProps> = {
    fontType: typographyStoryControls.fontType,
    children: { control: "text" },
    color: { control: "select", options: appearanceColorOptions },
    size: { control: "select", options: sizeOptions },
    variant: { control: "select", options: surfaceVariantOptions },
    tooltip: { control: "text" },
    tooltipPlacement: {
        control: "select",
        options: ["auto", "top", "right", "bottom", "left"],
    },
    tooltipVariant: { control: "select", options: fillVariantOptions },
    showTooltipConnection: { control: "boolean" },
};
