import { FC } from "react";
import { View, ViewStyle } from "react-native";
import { DividerProps, useTheme } from "@ui";

export const Divider: FC<DividerProps & { style?: ViewStyle }> = ({
    orientation = "horizontal",
    color,
    style,
}) => {
    const theme = useTheme();
    const dividerColor = color
        ? theme.color(color)
        : theme.componentColor("border");

    const dividerStyle: ViewStyle =
        orientation === "vertical"
            ? { width: 1, height: "100%", backgroundColor: dividerColor }
            : { height: 1, width: "100%", backgroundColor: dividerColor };

    return <View style={[dividerStyle, style]} />;
};
