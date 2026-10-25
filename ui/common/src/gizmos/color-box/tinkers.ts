import { ColorBoxProps } from "./model";
import {
    allColorShades,
    DEFAULT_SIZE,
    sizeOptions,
    Theme,
} from "../../design-system";
import { StoryControls } from "../../storybook";

export const colorBoxStoryArgs: ColorBoxProps = {
    name: "Copper",
    color: Theme.palette.copper,
    shade: 500,
    size: DEFAULT_SIZE,
    showPaletteOnHover: true,
};

export const colorBoxStoryControls: StoryControls<ColorBoxProps> = {
    name: { control: "text" },
    shade: { control: "select", options: allColorShades },
    size: {
        control: "select",
        options: sizeOptions,
    },
    showPaletteOnHover: { control: "boolean" },
};
