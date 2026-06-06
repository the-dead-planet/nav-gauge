import { FC } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { ColorVariant, HexagonProps, SizeVariant, useTheme } from "@ui";

const POINTY_TOP = "50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25";
const FLAT_TOP = "100,50 75,93.3 25,93.3 0,50 25,6.7 75,6.7";

const sizeWidth: Record<SizeVariant, number> = {
    xs: 36,
    sm: 48,
    md: 64,
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
});

export const Hexagon: FC<HexagonProps & { style?: object }> = ({
    shape = "pointy-top",
    strokeWidth = 2,
    color,
    variant,
    size,
    style,
    children
}) => {
    const theme = useTheme();
    const points = shape === "pointy-top" ? POINTY_TOP : FLAT_TOP;
    const aspectRatio = shape === "pointy-top" ? 2 / 1.7320508 : 1.7320508 / 2;
    const strokeColor = color ? theme.color(color as ColorVariant, 500) : undefined;

    return (
        <View style={[styles.container, { aspectRatio }, size ? { width: sizeWidth[size] } : undefined, style]}>
            <Svg
                viewBox="0 0 100 100"
                style={StyleSheet.absoluteFill}
            >
                <Polygon
                    points={points}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                />
            </Svg>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};
