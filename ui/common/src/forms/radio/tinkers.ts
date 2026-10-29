import { checkboxStoryArgs, checkboxStoryControls } from "../checkbox/tinkers";
import { StoryControls } from "../../storybook";
import { RadioProps } from "./model";

export const radioStoryArgs: Omit<RadioProps, "onChange"> = {
    ...checkboxStoryArgs,
    children: "Radio",
};

export const radioStoryControls: StoryControls<RadioProps> =
    checkboxStoryControls;
