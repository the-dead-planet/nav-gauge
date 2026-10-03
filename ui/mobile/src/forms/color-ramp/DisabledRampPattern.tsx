import { useTheme } from "@ui";
import { FC } from "react";
import { StyleSheet } from "react-native";
import Svg, { Defs, Line, Pattern, Rect } from "react-native-svg";

const styles = StyleSheet.create({
    pattern: {
        position: "absolute",
        inset: 0,
    },
});

export const DisabledRampPattern: FC = () => {
    const theme = useTheme();

    const color = theme.color("neutral", theme.isDark ? 300 : 700);

    return (
        <Svg
            width="100%"
            height="100%"
            style={styles.pattern}
            pointerEvents="none"
        >
            <Defs>
                <Pattern
                    id="disabled-stripes"
                    width="12"
                    height="12"
                    patternUnits="userSpaceOnUse"
                >
                    <Line
                        x1="-3"
                        y1="3"
                        x2="3"
                        y2="-3"
                        stroke={color}
                        strokeWidth="2"
                    />
                    <Line
                        x1="0"
                        y1="12"
                        x2="12"
                        y2="0"
                        stroke={color}
                        strokeWidth="2"
                    />
                    <Line
                        x1="9"
                        y1="15"
                        x2="15"
                        y2="9"
                        stroke={color}
                        strokeWidth="2"
                    />
                </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#disabled-stripes)" />
        </Svg>
    );
};
