import {
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
} from "../../design-system/tinkers";
import { typographyStoryControls } from "../../design-system/typography";
import { StoryControls } from "../../storybook";
import { hudSurfaceStoryArgs, hudSurfaceStoryControls } from "../tinkers";
import { hexagonStoryControls } from "../hexagon/tinkers";
import { OctagonProps } from "./model";

export const octagonStoryArgs: OctagonProps = {
    ...hudSurfaceStoryArgs,
    children: "O",
    variant: DEFAULT_SURFACE_VARIANT,
    size: DEFAULT_SIZE,
    themeMode: undefined,
    strokeWidth: undefined,
};

export const octagonStoryControls: StoryControls<OctagonProps> = {
    ...hudSurfaceStoryControls,
    themeMode: typographyStoryControls.themeMode,
    variant: hexagonStoryControls.variant,
    size: hexagonStoryControls.size,
    strokeWidth: hexagonStoryControls.strokeWidth,
};
