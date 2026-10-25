import { ColorBoxProps } from "./model";
import { allColorShades, Theme } from "../../design-system";
import { StoryControls } from "../../storybook";

export const colorBoxStoryArgs: ColorBoxProps = {
    name: "Copper",
    color: Theme.palette.copper,
    shade: 500,
    size: 24,
    showPaletteOnHover: true,
};

export const colorBoxStoryControls: StoryControls<ColorBoxProps> = {
    name: { control: "text" },
    shade: { control: "select", options: allColorShades },
    size: { control: { type: "range", min: 8, max: 64, step: 1 } },
    showPaletteOnHover: { control: "boolean" },
};

export const colorBoxGallerySizes: number[] = [12, 24, 48];
