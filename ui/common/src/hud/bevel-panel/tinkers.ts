import { SizeVariant } from "../../design-system/model";
import { DEFAULT_SIZE, sizeOptions } from "../../design-system/tinkers";
import { StoryControls } from "../../storybook/model";
import { hudSurfaceStoryArgs, hudSurfaceStoryControls } from "../tinkers";
import { BevelPanelProps } from "./model";

export const bevelDepths: Record<SizeVariant, number> = {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
};

export const getBevelPanelGeometry = (
    width: number,
    height: number,
    size: SizeVariant,
) => {
    const bevel = Math.max(0, Math.min(bevelDepths[size], width / 2 - 1));
    return {
        points: `${bevel},0.5 ${width - bevel},0.5 ${width - 0.5},${height / 2} ${width - bevel},${height - 0.5} ${bevel},${height - 0.5} 0.5,${height / 2}`,
        clipPath: `polygon(${bevel}px 0, calc(100% - ${bevel}px) 0, 100% 50%, calc(100% - ${bevel}px) 100%, ${bevel}px 100%, 0 50%)`,
    };
};

export const bevelPanelStoryArgs: BevelPanelProps = {
    ...hudSurfaceStoryArgs,
    size: DEFAULT_SIZE,
};

export const bevelPanelStoryControls: StoryControls<BevelPanelProps> = {
    ...hudSurfaceStoryControls,
    size: {
        control: "select",
        options: sizeOptions,
    },
};
