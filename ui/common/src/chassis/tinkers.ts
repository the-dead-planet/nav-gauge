import { SpacingVariant } from "../design-system/model";
import { Theme } from "../design-system/theme/theme";
import { StoryControl, StoryControls } from "../storybook/model";
import { AlignItems, JustifyContent } from "./model";
import { FlexBoxProps } from "./flex-box/model";

export const layoutSpacingOptions = Object.keys(Theme.spacing) as SpacingVariant[];
export const layoutJustifyOptions: JustifyContent[] = [
    "flex-start",
    "flex-end",
    "center",
    "space-between",
    "space-around",
    "space-evenly",
];
export const layoutAlignOptions: AlignItems[] = [
    "flex-start",
    "flex-end",
    "center",
    "stretch",
    "baseline",
];

export const resolveLayoutSpacing = (
    value?: SpacingVariant,
): number | undefined =>
    value ? Number.parseFloat(Theme.spacing[value]) : undefined;

const spacingControl: StoryControl = {
    control: "select",
    options: [undefined, ...layoutSpacingOptions],
};

export const layoutStoryControls: StoryControls<FlexBoxProps> = {
    gap: spacingControl,
    rowGap: spacingControl,
    colGap: spacingControl,
    justifyContent: {
        control: "select",
        options: [undefined, ...layoutJustifyOptions],
    },
    alignItems: {
        control: "select",
        options: [undefined, ...layoutAlignOptions],
    },
};
