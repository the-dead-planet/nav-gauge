import { FC } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import {
    DEFAULT_SIZE,
    DEFAULT_COLOR,
    defaultHudDecorationCorners,
    hudDecorationPaths,
    HudDecorationProps,
    hudDecorationSizes,
    useTheme,
} from "@ui";
import { HudContent } from "../HudContent";

const styles = StyleSheet.create({
    wrapper: {
        alignSelf: "flex-start",
        position: "relative",
    },
    decoration: {
        position: "absolute",
    },
});

export const HudDecoration: FC<HudDecorationProps> = ({
    children,
    color = DEFAULT_COLOR,
    size = DEFAULT_SIZE,
    activeGlow = "none",
    corners = defaultHudDecorationCorners,
}) => {
    const theme = useTheme();
    const appearance = theme.resolveAppearance(undefined, color);
    const { offset, strokeWidth } = hudDecorationSizes[size];
    return (
        <View style={styles.wrapper}>
            <HudContent appearance={theme.resolveAppearance()}>
                {children}
            </HudContent>
            <Svg
                style={[
                    styles.decoration,
                    {
                        top: -offset,
                        right: -offset,
                        bottom: -offset,
                        left: -offset,
                    },
                ]}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                pointerEvents="none"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
            >
                {activeGlow !== "none"
                    ? corners.map((corner) => (
                          <Path
                              key={`glow-${corner}`}
                              d={hudDecorationPaths[corner]}
                              fill="none"
                              stroke={appearance.effects.glowColor}
                              strokeWidth={strokeWidth + 6}
                              strokeOpacity={0.18}
                              vectorEffect="non-scaling-stroke"
                          />
                      ))
                    : null}
                {corners.map((corner) => (
                    <Path
                        key={corner}
                        d={hudDecorationPaths[corner]}
                        fill="none"
                        stroke={appearance.glyphs}
                        strokeWidth={strokeWidth}
                        vectorEffect="non-scaling-stroke"
                    />
                ))}
            </Svg>
        </View>
    );
};
