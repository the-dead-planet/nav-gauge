import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    sizeOptions,
} from "../../design-system/tinkers";
import { typographyStoryControls } from "../../design-system/typography";
import { StoryControls } from "../../storybook";
import { hudSurfaceStoryControls } from "../tinkers";
import { OctagonalPanelProps } from "./model";

export const octagonalPanelStoryArgs: OctagonalPanelProps = {
    children: "Preview",
    themeMode: undefined,
    color: DEFAULT_COLOR,
    highlightColor: undefined,
    variant: DEFAULT_FILL_VARIANT,
    size: DEFAULT_SIZE,
    highlighted: false,
    disabled: false,
};

export const octagonalPanelStoryControls: StoryControls<OctagonalPanelProps> = {
    themeMode: typographyStoryControls.themeMode,
    children: hudSurfaceStoryControls.children,
    color: hudSurfaceStoryControls.color,
    highlightColor: hudSurfaceStoryControls.highlightColor,
    variant: hudSurfaceStoryControls.variant,
    highlighted: hudSurfaceStoryControls.highlighted,
    disabled: hudSurfaceStoryControls.disabled,
    size: {
        control: "select",
        options: sizeOptions,
    },
};
