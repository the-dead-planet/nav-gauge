import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { ColorShade, ColorVariant, FontType, ThemeAppearanceState } from "@ui";
import { Text } from "../../design-system/typography";

const styles = StyleSheet.create({
    label: { flexDirection: "row", alignItems: "center", gap: 6 },
});

interface Props {
    label?: string;
    value: number;
    formatValue?: (value: number) => string;
    showValue: boolean;
    color: ColorVariant;
    highlightColor: ColorVariant;
    glyphsShade?: ColorShade;
    highlightGlyphsShade?: ColorShade;
    state: ThemeAppearanceState;
}

export const ClockLabel: FC<Props> = ({
    label,
    value,
    formatValue,
    showValue,
    color,
    highlightColor,
    glyphsShade,
    highlightGlyphsShade,
    state,
}) =>
    label ? (
        <View style={styles.label}>
            <Text
                color={color}
                highlightColor={highlightColor}
                shade={glyphsShade}
                highlightShade={highlightGlyphsShade}
                appearanceState={state}
            >
                {label}
            </Text>
            {showValue ? (
                <Text
                    color={color}
                    highlightColor={highlightColor}
                    shade={glyphsShade}
                    highlightShade={highlightGlyphsShade}
                    appearanceState={state}
                    fontType={FontType.Numeric}
                    tabular
                >
                    {formatValue?.(value) ?? `${value}°`}
                </Text>
            ) : null}
        </View>
    ) : null;
