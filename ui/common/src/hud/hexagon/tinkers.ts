import { HexagonProps, HexagonShape } from "./model";
import {
    DEFAULT_SIZE,
    DEFAULT_COLOR,
    DEFAULT_SURFACE_VARIANT,
    sizeOptions,
    surfaceVariantOptions,
} from "../../design-system/tinkers";
import { StoryControls } from "../../storybook";
import { hudSurfaceStoryControls } from "../tinkers";

export const hexagonShapes: HexagonShape[] = ["pointy-top", "flat-top"];

export const hexagonGeometry: Record<
    HexagonShape,
    {
        points: string;
        viewBox: string;
        aspectRatio: number;
        maskPoints: string;
        shadowPoints: string;
        highlightPoints: string;
    }
> = {
    "pointy-top": {
        points: "50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25",
        viewBox: "6.7 0 86.6 100",
        aspectRatio: 86.6 / 100,
        maskPoints: "50,0 100,25 100,75 50,100 0,75 0,25",
        shadowPoints: "93.3,25 50,0 6.7,25 6.7,75",
        highlightPoints: "93.3,25 93.3,75 50,100 6.7,75",
    },
    "flat-top": {
        points: "100,50 75,93.3 25,93.3 0,50 25,6.7 75,6.7",
        viewBox: "0 6.7 100 86.6",
        aspectRatio: 100 / 86.6,
        maskPoints: "100,50 75,100 25,100 0,50 25,0 75,0",
        shadowPoints: "75,6.7 25,6.7 0,50 25,93.3",
        highlightPoints: "75,6.7 100,50 75,93.3 25,93.3",
    },
};

export const hexagonStoryArgs: HexagonProps = {
    children: "H",
    color: DEFAULT_COLOR,
    variant: DEFAULT_SURFACE_VARIANT,
    size: DEFAULT_SIZE,
    shape: "pointy-top",
    strokeWidth: 1,
    interactive: true,
    highlighted: false,
    disabled: false,
    activeGlow: "none",
};

export const hexagonStoryControls: StoryControls<HexagonProps> = {
    ...hudSurfaceStoryControls,
    variant: {
        control: "select",
        options: surfaceVariantOptions,
    },
    size: {
        control: "select",
        options: sizeOptions,
    },
    shape: {
        control: "select",
        options: hexagonShapes,
    },
    strokeWidth: {
        control: {
            type: "range",
            min: 1,
            max: 8,
            step: 1,
        },
    },
};
