import { StoryControls } from "../../storybook";
import { textInputStoryArgs, textInputStoryControls } from "../text-input/tinkers";
import { TextAreaProps } from "./model";

export const textAreaStoryArgs: Omit<TextAreaProps, "onChange"> = {
    ...textInputStoryArgs,
    value: "Some text",
};

export const textAreaStoryControls: StoryControls<TextAreaProps> = textInputStoryControls;
