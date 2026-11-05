import {
    DEFAULT_COLOR,
    DEFAULT_SURFACE_VARIANT,
    DEFAULT_SIZE,
    sizeOptions,
    surfaceVariantOptions,
} from "../../design-system";
import { StoryControls } from "../../storybook";
import { hudSurfaceStoryControls } from "../tinkers";
import { OctagonalPanelProps } from "./model";

export const octagonalPanelStoryArgs: OctagonalPanelProps = {
    children: "Preview",
    color: DEFAULT_COLOR,
    highlightColor: undefined,
    variant: DEFAULT_SURFACE_VARIANT,
    size: DEFAULT_SIZE,
    highlighted: false,
    disabled: false,
};

export const octagonalPanelStoryControls: StoryControls<OctagonalPanelProps> = {
    children: hudSurfaceStoryControls.children,
    color: hudSurfaceStoryControls.color,
    highlightColor: hudSurfaceStoryControls.highlightColor,
    variant: {
        control: "select",
        options: surfaceVariantOptions,
    },
    highlighted: hudSurfaceStoryControls.highlighted,
    disabled: hudSurfaceStoryControls.disabled,
    size: {
        control: "select",
        options: sizeOptions,
    },
};
