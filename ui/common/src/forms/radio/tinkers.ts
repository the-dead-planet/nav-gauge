import { checkboxStoryArgs, checkboxStoryControls } from "../checkbox/tinkers";
import { StoryControls } from "../../storybook";
import { RadioProps } from "./model";
import { DEFAULT_GLYPH_CORNERS } from "../../design-system";

export const radioStoryArgs: Omit<RadioProps, "onChange"> = {
    ...checkboxStoryArgs,
    children: "Radio",
    corners: DEFAULT_GLYPH_CORNERS,
};

export const radioStoryControls: StoryControls<RadioProps> =
    checkboxStoryControls;
