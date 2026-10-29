import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import {
    CheckboxProps,
    DEFAULT_CORNERS,
    controlTextSpecifications,
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    ThemeContext,
    useTheme,
} from "@ui";
import { Text } from "../../design-system/typography";
import { useHudInteraction } from "../../hud/useHudInteraction";
import { HexagonSurface } from "../../hud/hexagon/HexagonSurface";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    box: {
        alignItems: "center",
        justifyContent: "center",
        borderStyle: "solid",
    },
});

export const Checkbox: FC<CheckboxProps> = ({
    themeMode,
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    variant = DEFAULT_FILL_VARIANT,
    size = DEFAULT_SIZE,
    corners = DEFAULT_CORNERS,
    checked,
    onChange,
    disabled = false,
    highlighted = false,
    children,
}) => {
    const theme = useTheme().forMode(themeMode);
    const { state, interaction, focused } = useHudInteraction({
        disabled,
        highlighted,
    });
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor,
        state,
    );
    const interactive = state === "hover-focus" || state === "active-pressed";
    const overrideShade = interactive ? highlightGlyphsShade : glyphsShade;
    const glyphs =
        disabled || overrideShade === undefined
            ? appearance.glyphs
            : theme.color(interactive ? highlightColor : color, overrideShade);
    const boxSize = theme.sizes.control[size].iconSize;

    return (
        <ThemeContext.Provider value={theme}>
            <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked, disabled }}
                disabled={disabled}
                onPress={() => onChange(!checked)}
                style={styles.container}
                {...interaction}
            >
                <View
                    style={[
                        styles.box,
                        {
                            width: boxSize,
                            height: boxSize,
                            borderRadius:
                                corners === "circle" ? boxSize / 2 : 0,
                            backgroundColor:
                                corners === "hexagon"
                                    ? "transparent"
                                    : appearance.surface,
                            borderColor: appearance.border.color,
                            borderWidth:
                                corners === "hexagon"
                                    ? 0
                                    : appearance.border.width,
                            outlineStyle: "solid",
                            outlineWidth: focused ? 2 : 0,
                            outlineOffset: 2,
                            outlineColor: appearance.effects.glowColor,
                        },
                    ]}
                >
                    {corners === "hexagon" ? (
                        <HexagonSurface
                            shape="flat-top"
                            appearance={appearance}
                            showGlow={false}
                        />
                    ) : null}
                    {checked ? (
                        <Svg
                            accessible={false}
                            width={boxSize * 0.7}
                            height={boxSize * 0.7}
                            viewBox="0 0 12 12"
                        >
                            <Path
                                d="M2 6l3 3 5-5"
                                fill="none"
                                stroke={glyphs}
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    ) : null}
                </View>
                {children ? (
                    <Text
                        color={color}
                        highlightColor={highlightColor}
                        shade={glyphsShade}
                        highlightShade={highlightGlyphsShade}
                        appearanceState={state}
                        style={controlTextSpecifications[size]}
                    >
                        {children}
                    </Text>
                ) : null}
            </Pressable>
        </ThemeContext.Provider>
    );
};
