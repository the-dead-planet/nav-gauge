import { FC } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ColorShade, RGBColor, ThemeColor, Theme, useTheme } from "@ui";
import { Label, Text } from "../typography";
import { ColorBox } from "./ColorBox";

const styles = StyleSheet.create({
  color: {
    gap: 4,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 40,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  shadeText: {
    fontSize: 7,
    lineHeight: 9,
  },
  rgbText: {
    fontSize: 5,
    lineHeight: 7,
  },
  labels: {
    alignItems: "flex-end",
    paddingRight: 6,
  },
  name: {
    fontSize: 14,
    lineHeight: 18,
  },
});

export const ColorPalette: FC = () => {
  const palette = Theme.palette;
  const entries = Object.entries(palette) as [string, ThemeColor][];

  return (
    <View style={{ padding: 8 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {entries.map(([name, color]) => {
            const data = Object.entries(color) as unknown as [
              ColorShade,
              RGBColor,
            ][];

            return (
              <View key={name} style={styles.color}>
                <Label bold style={styles.name}>
                  {name}
                </Label>
                <View style={styles.row}>
                  <View style={[styles.box, styles.labels]}>
                    <Text bold style={styles.shadeText}>100</Text>
                    <Text bold style={styles.shadeText}>900</Text>
                    <Text bold style={styles.shadeText}>contrast</Text>
                    <Text bold style={styles.rgbText}>rgb</Text>
                  </View>
                  {data.map(([shade, c]) => {
                    const contrastColor =
                      color[Theme.contrastShade(color, shade)];

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
                              color: `rgb(${color[100].r}, ${color[100].g}, ${color[100].b})`,
                            },
                          ]}
                        >
                          {shade}
                        </Text>
                        <Text
                          style={[
                            styles.shadeText,
                            {
                              color: `rgb(${color[900].r}, ${color[900].g}, ${color[900].b})`,
                            },
                          ]}
                        >
                          {shade}
                        </Text>
                        <Text
                          style={[
                            styles.shadeText,
                            {
                              color: `rgb(${contrastColor.r}, ${contrastColor.g}, ${contrastColor.b})`,
                            },
                          ]}
                        >
                          {shade}
                        </Text>
                        <Text
                          style={[
                            styles.rgbText,
                            {
                              color: `rgb(${contrastColor.r}, ${contrastColor.g}, ${contrastColor.b})`,
                            },
                          ]}
                        >
                          {c.r}, {c.g}, {c.b}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export const ComponentColors = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {Object.entries(theme.componentColors).map(([name, color]) => (
        <View key={name} style={{ flexDirection: "row", gap: 20 }}>
          <Text style={{ minWidth: 100 }}>{name}</Text>
          <ColorBox
            color={theme.colors[color.name]}
            shade={color.shade}
            size={40}
          />
        </View>
      ))}
    </View>
  );
};
