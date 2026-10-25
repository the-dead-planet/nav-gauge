import { FC, useId } from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
    Polygon,
    Polyline,
    Defs,
    ClipPath,
    RadialGradient,
    Stop,
} from "react-native-svg";
import { hexagonGeometry, HexagonProps, ResolvedThemeAppearance } from "@ui";
import { HudContent } from "../HudContent";
import { HudGlow } from "../HudGlow";

const styles = StyleSheet.create({
    content: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
});

interface Props extends Pick<
    HexagonProps,
    "shape" | "strokeWidth" | "children"
> {
    appearance: ResolvedThemeAppearance;
    showGlow: boolean;
}

export const HexagonSurface: FC<Props> = ({
    shape = "pointy-top",
    strokeWidth,
    appearance,
    showGlow,
    children,
}) => {
    const { points, viewBox, shadowPoints, highlightPoints } =
        hexagonGeometry[shape];
    const clipPathId = useId();
    const recessGradientId = useId();
    const content = (
        <>
            <Svg
                viewBox={viewBox}
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
                    strokeWidth={
                        appearance.border.width * Math.max(0, strokeWidth ?? 1)
                    }
                    vectorEffect="non-scaling-stroke"
                />
                {appearance.effects.depth === "inset" ? (
                    <>
                        <Defs>
                            <ClipPath id={clipPathId}>
                                <Polygon points={points} />
                            </ClipPath>
                            <RadialGradient id={recessGradientId}>
                                <Stop
                                    offset="0"
                                    stopColor={appearance.effects.inset.recess}
                                />
                                <Stop
                                    offset=".65"
                                    stopColor={appearance.effects.inset.recess}
                                />
                                <Stop
                                    offset="1"
                                    stopColor={appearance.effects.inset.recess}
                                    stopOpacity={0}
                                />
                            </RadialGradient>
                        </Defs>
                        <Polygon
                            points={points}
                            fill={`url(#${recessGradientId})`}
                        />
                        <Polyline
                            points={shadowPoints}
                            fill="none"
                            stroke={appearance.effects.inset.shadow}
                            strokeWidth={10}
                            strokeOpacity={0.28}
                            clipPath={`url(#${clipPathId})`}
                        />
                        <Polyline
                            points={highlightPoints}
                            fill="none"
                            stroke={appearance.effects.inset.highlight}
                            strokeWidth={10}
                            strokeOpacity={0.28}
                            clipPath={`url(#${clipPathId})`}
                        />
                        <Polyline
                            points={shadowPoints}
                            fill="none"
                            stroke={appearance.effects.inset.shadow}
                            strokeWidth={3}
                            clipPath={`url(#${clipPathId})`}
                        />
                        <Polyline
                            points={highlightPoints}
                            fill="none"
                            stroke={appearance.effects.inset.highlight}
                            strokeWidth={3}
                            clipPath={`url(#${clipPathId})`}
                        />
                    </>
                ) : null}
            </Svg>
            <View style={styles.content}>
                <HudContent appearance={appearance}>{children}</HudContent>
            </View>
        </>
    );

    return content;
};
