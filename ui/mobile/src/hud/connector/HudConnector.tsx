import { FC, RefObject } from "react";
import { HostInstance, StyleSheet, View } from "react-native";
import Svg, { Polygon, Polyline } from "react-native-svg";
import { DEFAULT_COLOR, getHudConnectorGeometry, HudConnectorProps, useTheme } from "@ui";
import { resolveLayerStyle } from "../../design-system/theme";
import { useConnectorPoints } from "./useConnectorPoints";

const styles = StyleSheet.create({
    wrapper: {
        position: "relative",
    },
});

interface Props extends HudConnectorProps {
    fromRef: RefObject<HostInstance | null>;
    toRef: RefObject<HostInstance | null>;
}

export const HudConnector: FC<Props> = ({
    children,
    fromRef,
    toRef,
    color = DEFAULT_COLOR,
    activeGlow = "none",
    fromAnchor = "center",
    toAnchor = "center",
}) => {
    const theme = useTheme();
    const { wrapperRef, points, onLayout } = useConnectorPoints(
        fromRef,
        toRef,
        fromAnchor,
        toAnchor,
        children,
    );
    const appearance = theme.resolveAppearance(undefined, color);
    const geometry = points ? getHudConnectorGeometry(points) : null;
    return (
        <View ref={wrapperRef} style={styles.wrapper} onLayout={onLayout}>
            {children}
            {geometry ? (
                <Svg
                    style={[
                        StyleSheet.absoluteFill,
                        resolveLayerStyle(theme, "hud-connector"),
                    ]}
                    pointerEvents="none"
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                >
                    {activeGlow !== "none" ? (
                        <Polyline
                            points={geometry.path}
                            fill="none"
                            stroke={appearance.effects.glowColor}
                            strokeWidth={7}
                            strokeOpacity={0.16}
                        />
                    ) : null}
                    <Polyline
                        points={geometry.path}
                        fill="none"
                        stroke={appearance.glyphs}
                        strokeWidth={1}
                    />
                    <Polygon
                        points={geometry.marker}
                        fill={appearance.glyphs}
                    />
                </Svg>
            ) : null}
        </View>
    );
};
