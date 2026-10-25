import { StoryControls } from "../../storybook/model";
import { hudSurfaceStoryArgs, hudSurfaceStoryControls } from "../tinkers";
import { NotchedPanelProps } from "./model";

export const getNotchedPanelGeometry = (
    width: number,
    height: number,
    headerHeight: number,
) => {
    const notch = Math.min(18, width / 5, height / 4);
    const step = Math.min(10, width / 10);
    return {
        bodyPoints: `${notch},1 ${width - notch - step},1 ${width - 1},${notch + step} ${width - 1},${height - notch} ${width - notch},${height - 1} ${width * 0.58},${height - 1} ${width * 0.54},${height - step} ${notch + step},${height - step} ${notch},${height - 1} 1,${height - notch} 1,${notch}`,
        headerPoints: `${width - notch},${headerHeight} ${width * 0.58},${headerHeight} ${width * 0.54},${Math.max(1, headerHeight - step)} ${notch + step},${Math.max(1, headerHeight - step)} 1,${Math.max(1, headerHeight - notch)}`,
        stepPoints: `${notch + 7},${height - 6} ${width * 0.38},${height - 6} ${width * 0.42},${height - 2}`,
    };
};

export const notchedPanelStoryArgs: NotchedPanelProps = {
    ...hudSurfaceStoryArgs,
    header: "Navigation",
};

export const notchedPanelStoryControls: StoryControls<NotchedPanelProps> = {
    ...hudSurfaceStoryControls,
    header: {
        control: "text",
    },
};
