import { StoryControls } from "../../storybook";
import { TileProps } from "./model";

export const tileStoryArgs = {
  name: "Navigation controls",
  description: "Controls for moving around the map and route.",
} satisfies TileProps;

export const tileStoryControls = {
  name: { control: "text" },
  description: { control: "text" },
} satisfies StoryControls<TileProps>;
