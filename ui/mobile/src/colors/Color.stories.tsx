import { FC } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ColorShade, RGBColor, ThemeColor, Theme } from "@ui";
import { Text } from "../typography";

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    box: {
        width: 32,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 2,
    },
    name: {
        width: 64,
        marginRight: 8,
    },
    shadeText: {
        fontSize: 8,
    },
});

export const ColorPalette: FC = () => {
    const palette = Theme.palette;
    const entries = Object.entries(palette) as [string, ThemeColor][];

    return (
        <View style={{ padding: 8 }}>
            {entries.map(([name, color]) => {
                const data = Object.entries(color) as unknown as [ColorShade, RGBColor][];
                const reversed = [...data].reverse();

                return (
                    <View key={name} style={styles.row}>
                        <Text style={styles.name}>{name}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {data.map(([shade, c], i) => {
                                const textColor = reversed[i][1];

                                return (
                                    <View
                                        key={shade}
                                        style={[
                                            styles.box,
                                            {
                                                backgroundColor: `rgb(${c.r}, ${c.g}, ${c.b})`,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.shadeText,
                                                {
                                                    color: `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`,
                                                },
                                            ]}
                                        >
                                            {shade}
                                        </Text>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                );
            })}
        </View>
    );
};
