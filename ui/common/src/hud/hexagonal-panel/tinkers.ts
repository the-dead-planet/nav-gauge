import { HexagonShape, SizeVariant } from "../../design-system/model";
import { DEFAULT_SIZE, sizeOptions } from "../../design-system/tinkers";
import { StoryControls } from "../../storybook/model";
import { hudSurfaceStoryArgs, hudSurfaceStoryControls } from "../tinkers";
import { typographyStoryControls } from "../../design-system/typography";
import { hexagonShapes } from "../hexagon/tinkers";
import { HexagonalPanelProps } from "./model";

export const DEFAULT_HEXAGONAL_PANEL_SHAPE: HexagonShape = "flat-top";

const hexagonalPanelDepths: Record<SizeVariant, number> = {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
};

export const getHexagonalPanelGeometry = (
    width: number,
    height: number,
    size: SizeVariant,
    shape: HexagonShape = DEFAULT_HEXAGONAL_PANEL_SHAPE,
) => {
    const depth = Math.max(
        0,
        Math.min(
            hexagonalPanelDepths[size],
            (shape === "flat-top" ? width : height) / 2 - 1,
        ),
    );
    if (shape === "pointy-top") {
        return {
            points: `${width / 2},0.5 ${width - 0.5},${depth} ${width - 0.5},${height - depth} ${width / 2},${height - 0.5} 0.5,${height - depth} 0.5,${depth}`,
            clipPath: `polygon(50% 0, 100% ${depth}px, 100% calc(100% - ${depth}px), 50% 100%, 0 calc(100% - ${depth}px), 0 ${depth}px)`,
        };
    }
    return {
        points: `${depth},0.5 ${width - depth},0.5 ${width - 0.5},${height / 2} ${width - depth},${height - 0.5} ${depth},${height - 0.5} 0.5,${height / 2}`,
        clipPath: `polygon(${depth}px 0, calc(100% - ${depth}px) 0, 100% 50%, calc(100% - ${depth}px) 100%, ${depth}px 100%, 0 50%)`,
    };
};

export const hexagonalPanelStoryArgs: HexagonalPanelProps = {
    ...hudSurfaceStoryArgs,
    size: DEFAULT_SIZE,
    shape: DEFAULT_HEXAGONAL_PANEL_SHAPE,
    themeMode: undefined,
};

export const hexagonalPanelStoryControls: StoryControls<HexagonalPanelProps> = {
    ...hudSurfaceStoryControls,
    themeMode: typographyStoryControls.themeMode,
    shape: {
        control: "select",
        options: hexagonShapes,
    },
    size: {
        control: "select",
        options: sizeOptions,
    },
};
