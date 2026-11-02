import { FC, useId } from "react";
import { StyleSheet } from "react-native";
import Svg, {
    Defs,
    Polygon,
    Filter,
    FeGaussianBlur,
    FeOffset,
    FeComposite,
    FeFlood,
    FeMerge,
    FeMergeNode,
} from "react-native-svg";
import { DEFAULT_SIZE, getOctagonalGeometry, OctagonalSurfaceProps } from "@ui";
import { HudGlow } from "../HudGlow";

export const OctagonalSurface: FC<OctagonalSurfaceProps> = ({
    width,
    height,
    size = DEFAULT_SIZE,
    appearance,
    regular = false,
    strokeWidth,
    showGlow = false,
}) => {
    const insetFilterId = useId();
    const borderWidth = appearance.border.width * Math.max(0, strokeWidth ?? 1);
    const { points } = getOctagonalGeometry(
        width,
        height,
        size,
        borderWidth / 2,
        regular,
    );
    return (
        <Svg
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
        >
            {showGlow ? (
                <HudGlow
                    points={points}
                    color={appearance.effects.glowColor}
                    strokeWidth={strokeWidth ?? 1}
                />
            ) : null}
            <Polygon
                points={points}
                fill={appearance.surface}
                stroke={appearance.border.color}
                strokeWidth={borderWidth}
                vectorEffect="non-scaling-stroke"
                filter={
                    appearance.effects.depth === "inset"
                        ? `url(#${insetFilterId})`
                        : undefined
                }
            />
            {appearance.effects.depth === "inset" ? (
                <Defs>
                    <Filter
                        id={insetFilterId}
                        x="0"
                        y="0"
                        width={width}
                        height={height}
                        filterUnits="userSpaceOnUse"
                    >
                        <FeGaussianBlur
                            in="SourceAlpha"
                            stdDeviation="2"
                            result="blur"
                        />
                        <FeOffset
                            in="blur"
                            dx="3"
                            dy="3"
                            result="shadow-offset"
                        />
                        <FeComposite
                            in="SourceAlpha"
                            in2="shadow-offset"
                            operator="out"
                            result="shadow-mask"
                        />
                        <FeFlood
                            floodColor={appearance.effects.inset.shadow}
                            result="shadow-color"
                        />
                        <FeComposite
                            in="shadow-color"
                            in2="shadow-mask"
                            operator="in"
                            result="shadow"
                        />
                        <FeOffset
                            in="blur"
                            dx="-2"
                            dy="-2"
                            result="highlight-offset"
                        />
                        <FeComposite
                            in="SourceAlpha"
                            in2="highlight-offset"
                            operator="out"
                            result="highlight-mask"
                        />
                        <FeFlood
                            floodColor={appearance.effects.inset.highlight}
                            result="highlight-color"
                        />
                        <FeComposite
                            in="highlight-color"
                            in2="highlight-mask"
                            operator="in"
                            result="highlight"
                        />
                        <FeMerge>
                            <FeMergeNode in="SourceGraphic" />
                            <FeMergeNode in="shadow" />
                            <FeMergeNode in="highlight" />
                        </FeMerge>
                    </Filter>
                </Defs>
            ) : null}
        </Svg>
    );
};
