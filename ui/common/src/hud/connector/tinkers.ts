import {
    activeGlowOptions,
    appearanceColorOptions,
    DEFAULT_COLOR,
} from "../../design-system/tinkers";
import { StoryControls } from "../../storybook/model";
import {
    HudConnectorAnchor,
    HudConnectorProps,
    HudPoint,
    HudRectangle,
} from "./model";

export const hudConnectorAnchors: HudConnectorAnchor[] = [
    "top-left",
    "top",
    "top-right",
    "right",
    "bottom-right",
    "bottom",
    "bottom-left",
    "left",
    "center",
];

export const getHudAnchorPoint = (
    rectangle: HudRectangle,
    anchor: HudConnectorAnchor,
    wrapper: HudRectangle,
): HudPoint => {
    const horizontal = anchor.endsWith("left")
        ? 0
        : anchor.endsWith("right")
          ? 1
          : 0.5;
    const vertical = anchor.startsWith("top")
        ? 0
        : anchor.startsWith("bottom")
          ? 1
          : 0.5;
    return {
        x: rectangle.x - wrapper.x + rectangle.width * horizontal,
        y: rectangle.y - wrapper.y + rectangle.height * vertical,
    };
};

export const getHudConnectorGeometry = ([from, to]: readonly [
    HudPoint,
    HudPoint,
]) => {
    const bend = Math.max(8, Math.abs(to.y - from.y) / 2);
    return {
        path: `${from.x},${from.y} ${from.x},${from.y - bend} ${to.x},${to.y + bend} ${to.x},${to.y}`,
        marker: `${to.x - 4},${to.y} ${to.x - 2},${to.y - 3.5} ${to.x + 2},${to.y - 3.5} ${to.x + 4},${to.y} ${to.x + 2},${to.y + 3.5} ${to.x - 2},${to.y + 3.5}`,
    };
};

export const hudConnectorStoryArgs: HudConnectorProps = {
    children: "Preview",
    color: DEFAULT_COLOR,
    activeGlow: "none",
    fromAnchor: "right",
    toAnchor: "left",
};

export const hudConnectorStoryControls: StoryControls<HudConnectorProps> = {
    color: { control: "select", options: appearanceColorOptions },
    activeGlow: { control: "select", options: activeGlowOptions },
    fromAnchor: { control: "select", options: hudConnectorAnchors },
    toAnchor: { control: "select", options: hudConnectorAnchors },
};
