import { ScrollView, StyleSheet, View, ViewProps } from "react-native";
import { DEFAULT_COLOR, DEFAULT_SIZE, MenuListProps, useTheme } from "@ui";
import { resolveLayerStyle } from "../../design-system/theme";

const styles = StyleSheet.create({
    surface: {
        position: "absolute",
        maxWidth: "100%",
        maxHeight: 240,
        borderRadius: 0,
    },
});

export function MenuList({
    color = DEFAULT_COLOR,
    size = DEFAULT_SIZE,
    children,
    style,
    ...props
}: MenuListProps & Omit<ViewProps, keyof MenuListProps>) {
    const theme = useTheme();
    const appearance = theme.resolveAppearance("fill-inverse", color);

    return (
        <View
            {...props}
            style={[
                styles.surface,
                {
                    backgroundColor: appearance.surface,
                    borderColor: appearance.border.color,
                    borderWidth: appearance.border.width,
                },
                resolveLayerStyle(theme, "dropdown", "down"),
                style,
            ]}
        >
            <ScrollView
                contentContainerStyle={{
                    paddingVertical: theme.sizes.menuList[size].paddingBlock,
                }}
            >
                {children}
            </ScrollView>
        </View>
    );
}
