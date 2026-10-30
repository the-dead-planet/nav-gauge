import { FC, useId } from "react";
import { StyleSheet } from "react-native";
import Svg, { ClipPath, Defs, Polygon, Polyline } from "react-native-svg";
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
    const clipPathId = useId();
    const borderWidth = appearance.border.width * Math.max(0, strokeWidth ?? 1);
    const { points } = getOctagonalGeometry(
        width,
        height,
        size,
        borderWidth / 2,
        regular,
    );
    const {
        points: outline,
        shadowPoints,
        highlightPoints,
    } = getOctagonalGeometry(width, height, size, 0, regular);
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
            />
            {appearance.effects.depth === "inset" ? (
                <>
                    <Defs>
                        <ClipPath id={clipPathId}>
                            <Polygon points={outline} />
                        </ClipPath>
                    </Defs>
                    <Polyline
                        points={shadowPoints}
                        fill="none"
                        stroke={appearance.effects.inset.shadow}
                        strokeWidth={6}
                        clipPath={`url(#${clipPathId})`}
                    />
                    <Polyline
                        points={highlightPoints}
                        fill="none"
                        stroke={appearance.effects.inset.highlight}
                        strokeWidth={4}
                        clipPath={`url(#${clipPathId})`}
                    />
                </>
            ) : null}
        </Svg>
    );
};
