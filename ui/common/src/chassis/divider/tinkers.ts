import { StoryControl, StoryControls } from "../../storybook/model";
import { appearanceColorOptions } from "../../design-system/tinkers";
import { Theme } from "../../design-system/theme/theme";
import { DividerProps } from "./model";

export const dividerStoryArgs: DividerProps = {
    orientation: "horizontal",
    color: "neutral",
};

const marginControl: StoryControl = {
    control: "select",
    options: [undefined, ...Object.keys(Theme.spacing)],
};

export const dividerStoryControls: StoryControls<DividerProps> = {
    orientation: {
        control: "select",
        options: ["horizontal", "vertical"],
    },
    color: {
        control: "select",
        options: appearanceColorOptions,
    },
    m: marginControl,
    mv: marginControl,
    mh: marginControl,
    mt: marginControl,
    mr: marginControl,
    mb: marginControl,
    ml: marginControl,
};
