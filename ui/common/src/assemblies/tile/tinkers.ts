import {
    DEFAULT_SIZE,
    elevationLevelOptions,
    sizeOptions,
} from "../../design-system";
import { StoryControls } from "../../storybook";
import {
    hudSurfaceStoryArgs,
    hudSurfaceStoryControls,
} from "../../hud/tinkers";
import { TileStoryProps } from "./model";

export const tileStoryArgs: TileStoryProps = {
    ...hudSurfaceStoryArgs,
    name: "Navigation controls",
    description: "Controls for moving around the map and route.",
    size: DEFAULT_SIZE,
    elevation: "raised",
};

export const tileStoryControls: StoryControls<TileStoryProps> = {
    ...hudSurfaceStoryControls,
    name: {
        control: "text",
    },
    description: {
        control: "text",
    },
    size: {
        control: "select",
        options: sizeOptions,
    },
    elevation: {
        control: "select",
        options: elevationLevelOptions,
    },
};
