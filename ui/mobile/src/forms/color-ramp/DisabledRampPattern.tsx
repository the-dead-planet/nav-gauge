import { DEFAULT_COLOR, DEFAULT_VARIANT, useTheme } from "@ui";
import { FC } from "react";
import { StyleSheet } from "react-native";
import Svg, { Defs, Path, Pattern, Rect } from "react-native-svg";

const styles = StyleSheet.create({
    pattern: {
        position: "absolute",
        inset: 0,
    },
});

export const DisabledRampPattern: FC = () => {
    const theme = useTheme();

    const color = theme.resolveAppearance(
        DEFAULT_VARIANT,
        DEFAULT_COLOR,
        DEFAULT_COLOR,
        "disabled",
    ).glyphs;

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
                    <Path
                        d="M-3 3 3-3M0 12 12 0M9 15 15 9"
                        stroke={color}
                        strokeWidth="2"
                    />
                </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#disabled-stripes)" />
        </Svg>
    );
};
