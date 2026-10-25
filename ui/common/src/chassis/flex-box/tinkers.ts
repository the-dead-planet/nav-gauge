import { StoryControls } from "../../storybook/model";
import {
    layoutAlignOptions,
    layoutJustifyOptions,
    layoutSpacingOptions,
    layoutStoryControls,
} from "../tinkers";
import { FlexBoxProps, FlexDirection } from "./model";

export const flexDirectionOptions: FlexDirection[] = [
    "row",
    "column",
    "row-reverse",
    "column-reverse",
];

export const flexBoxStoryArgs: FlexBoxProps = {
    direction: "row",
    gap: "sm",
};

export const flexBoxStoryControls: StoryControls<FlexBoxProps> = {
    ...layoutStoryControls,
    direction: {
        control: "select",
        options: flexDirectionOptions,
    },
};

export const flexBoxGalleryCases: { label: string; props: FlexBoxProps }[] = [
    ...flexDirectionOptions.map(
        (direction): { label: string; props: FlexBoxProps } => ({
            label: `direction: ${direction}`,
            props: { direction, gap: "sm" },
        }),
    ),
    ...layoutJustifyOptions.map(
        (justifyContent): { label: string; props: FlexBoxProps } => ({
            label: `justify: ${justifyContent}`,
            props: { justifyContent, gap: "xs" },
        }),
    ),
    ...layoutAlignOptions.map(
        (alignItems): { label: string; props: FlexBoxProps } => ({
            label: `align: ${alignItems}`,
            props: { alignItems, gap: "sm" },
        }),
    ),
    ...layoutSpacingOptions.map((gap) => ({
        label: `gap: ${gap}`,
        props: { gap },
    })),
    {
        label: "axis overrides: column",
        props: { direction: "column", gap: "xl", rowGap: "xs", colGap: "lg" },
    },
    {
        label: "axis overrides: row",
        props: { gap: "xl", rowGap: "xs", colGap: "lg" },
    },
];
