import { StoryControls } from "../../storybook/model";
import {
    layoutAlignOptions,
    layoutJustifyOptions,
    layoutSpacingOptions,
    layoutStoryControls,
} from "../tinkers";
import { GridProps, GridTemplateVariant } from "./model";

export const gridTemplateOptions: GridTemplateVariant[] = [
    "equal-1",
    "equal-2",
    "equal-3",
    "equal-4",
    "equal-5",
    "equal-6",
    "max-content-1",
    "max-content-2",
    "max-content-3",
    "max-content-4",
    "max-content-5",
    "max-content-6",
];

export const gridStoryArgs: GridProps = {
    cols: "equal-3",
    gap: "sm",
};

export const gridStoryControls: StoryControls<GridProps> = {
    ...layoutStoryControls,
    cols: {
        control: "select",
        options: [undefined, ...gridTemplateOptions],
    },
};

export const gridGalleryCases: { label: string; props: GridProps }[] = [
    { label: "implicit single column", props: {} },
    ...gridTemplateOptions.map((cols): { label: string; props: GridProps } => ({
        label: cols,
        props: { cols, gap: "xs" },
    })),
    ...layoutSpacingOptions.map((gap): { label: string; props: GridProps } => ({
        label: `gap: ${gap}`,
        props: { cols: "equal-3", gap },
    })),
    ...layoutJustifyOptions.map(
        (justifyContent): { label: string; props: GridProps } => ({
            label: `justify: ${justifyContent}`,
            props: { cols: "max-content-3", justifyContent, gap: "xs" },
        }),
    ),
    ...layoutAlignOptions.map(
        (alignItems): { label: string; props: GridProps } => ({
            label: `align: ${alignItems}`,
            props: { cols: "equal-3", alignItems, gap: "sm" },
        }),
    ),
    {
        label: "axis overrides",
        props: { cols: "equal-3", gap: "xl", rowGap: "xs", colGap: "lg" },
    },
];
