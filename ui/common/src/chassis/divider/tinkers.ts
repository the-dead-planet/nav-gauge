import { StoryControl, StoryControls } from "../../storybook/model";
import { appearanceColorOptions, DEFAULT_COLOR } from "../../design-system/tinkers";
import { Theme } from "../../design-system/theme/theme";
import { DividerProps } from "./model";

export const dividerStoryArgs: DividerProps = {
    orientation: "horizontal",
    color: DEFAULT_COLOR,
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
