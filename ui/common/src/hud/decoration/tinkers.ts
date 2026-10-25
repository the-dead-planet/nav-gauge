import { SizeVariant } from "../../design-system/model";
import {
    activeGlowOptions,
    appearanceColorOptions,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    sizeOptions,
} from "../../design-system/tinkers";
import { StoryControls } from "../../storybook/model";
import { HudDecorationCorner, HudDecorationProps } from "./model";

export const hudDecorationPaths: Record<HudDecorationCorner, string> = {
    "top-left": "M 1 24 V 8 H 8 V 1 H 24",
    "top-right": "M 76 1 H 92 V 8 H 99 V 24",
    "bottom-left": "M 1 76 V 92 H 8 V 99 H 24",
    "bottom-right": "M 76 99 H 92 V 92 H 99 V 76",
};

export const hudDecorationCorners: HudDecorationCorner[] = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
];
export const defaultHudDecorationCorners: readonly HudDecorationCorner[] = [
    "top-left",
    "bottom-right",
];
export const hudDecorationCornerSets: {
    label: string;
    corners: readonly HudDecorationCorner[];
}[] = [
    { label: "Default", corners: defaultHudDecorationCorners },
    { label: "All", corners: hudDecorationCorners },
    { label: "None", corners: [] },
    ...hudDecorationCorners.map((corner) => ({
        label: corner,
        corners: [corner],
    })),
];
export const hudDecorationSizes: Record<
    SizeVariant,
    { offset: number; strokeWidth: number }
> = {
    xs: { offset: 3, strokeWidth: 1 },
    sm: { offset: 5, strokeWidth: 1.5 },
    md: { offset: 7, strokeWidth: 2 },
    lg: { offset: 9, strokeWidth: 2.5 },
};

export const hudDecorationStoryArgs: HudDecorationProps = {
    children: "Preview",
    color: DEFAULT_COLOR,
    size: DEFAULT_SIZE,
    activeGlow: "none",
    corners: defaultHudDecorationCorners,
};

export const hudDecorationStoryControls: StoryControls<HudDecorationProps> = {
    children: { control: "text" },
    color: { control: "select", options: appearanceColorOptions },
    size: { control: "select", options: sizeOptions },
    activeGlow: { control: "select", options: activeGlowOptions },
    corners: {
        control: "select",
        options: hudDecorationCornerSets.map(({ label }) => label),
        mapping: Object.fromEntries(
            hudDecorationCornerSets.map(({ label, corners }) => [
                label,
                corners,
            ]),
        ),
    },
};
