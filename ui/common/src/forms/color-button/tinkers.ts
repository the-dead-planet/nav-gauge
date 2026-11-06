import { DEFAULT_SIZE, sizeOptions } from "../../design-system";
import { StoryControls } from "../../storybook";
import { ColorButtonProps } from "./model";

export const colorButtonStoryArgs: ColorButtonProps = {
    label: "Color",
    value: "#336699",
    size: DEFAULT_SIZE,
    selected: false,
    disabled: false,
};

export const colorButtonStoryControls: StoryControls<ColorButtonProps> = {
    value: {
        control: "text",
    },
    label: {
        control: "text",
    },
    size: {
        control: "select",
        options: sizeOptions,
    },
    selected: {
        control: "boolean",
    },
    disabled: {
        control: "boolean",
    },
};
