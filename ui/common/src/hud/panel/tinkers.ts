import {
    DEFAULT_ELEVATION,
    elevationLevelOptions,
} from "../../design-system/tinkers";
import { Theme } from "../../design-system/theme/theme";
import { StoryControls } from "../../storybook/model";
import { hudSurfaceStoryArgs, hudSurfaceStoryControls } from "../tinkers";
import { PanelProps } from "./model";

export const panelStoryArgs: PanelProps = {
    ...hudSurfaceStoryArgs,
    elevation: DEFAULT_ELEVATION,
};

export const panelStoryControls: StoryControls<PanelProps> = {
    ...hudSurfaceStoryControls,
    borderWidth: {
        control: { type: "range", min: 0, max: 8, step: 1 },
    },
    elevation: {
        control: "select",
        options: elevationLevelOptions,
    },
    elevationLayer: {
        control: "select",
        options: [undefined, ...Object.keys(Theme.layers)],
    },
};
