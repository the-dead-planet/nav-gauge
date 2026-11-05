import { DEFAULT_SIZE, DEFAULT_SURFACE_VARIANT } from "../../design-system";
import { StoryControls } from "../../storybook";
import { hudSurfaceStoryArgs, hudSurfaceStoryControls } from "../tinkers";
import { hexagonStoryControls } from "../hexagon/tinkers";
import { OctagonProps } from "./model";

export const octagonStoryArgs: OctagonProps = {
    ...hudSurfaceStoryArgs,
    children: "O",
    variant: DEFAULT_SURFACE_VARIANT,
    size: DEFAULT_SIZE,
    strokeWidth: undefined,
};

export const octagonStoryControls: StoryControls<OctagonProps> = {
    ...hudSurfaceStoryControls,
    variant: hexagonStoryControls.variant,
    size: hexagonStoryControls.size,
    strokeWidth: hexagonStoryControls.strokeWidth,
};
