import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { allColorShades, ColorBoxProps, toCssColor, useTheme } from "@ui";
import { Tooltip } from "../tooltip";
import { Text } from "../../design-system/typography";

const styles = StyleSheet.create({
    swatch: {
        flexShrink: 0,
    },
    palette: {
        flexDirection: "row",
    },
    shade: {
        width: 16,
        height: 28,
    },
});

export const ColorBox: FC<ColorBoxProps> = ({
    name = "Color",
    color,
    shade = 500,
    size = 12,
    showPaletteOnHover = false,
}) => {
    const theme = useTheme();
    const appearance = theme.resolveAppearance();
    const swatch = (
        <View
            accessible
            accessibilityRole="image"
            accessibilityLabel={`${name}, shade ${shade}`}
            style={[
                styles.swatch,
                {
                    width: size,
                    height: size,
                    borderWidth: appearance.border.width,
                    borderColor: appearance.border.color,
                    backgroundColor: toCssColor({ ...color[shade], a: 1 }),
                },
            ]}
        />
    );

    return showPaletteOnHover ? (
        <Tooltip
            content={
                <View>
                    <Text>{name}</Text>
                    <View style={styles.palette}>
                        {allColorShades.map((paletteShade) => (
                            <View
                                key={paletteShade}
                                style={[
                                    styles.shade,
                                    {
                                        backgroundColor: toCssColor({
                                            ...color[paletteShade],
                                            a: 1,
                                        }),
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </View>
            }
        >
            {swatch}
        </Tooltip>
    ) : (
        swatch
    );
};
