import { FC } from "react";
import { View, ViewStyle } from "react-native";
import { DividerProps, SpacingVariant, useTheme } from "@ui";

const spacingMap: Record<SpacingVariant, number> = {
    xs: 5,
    sm: 10,
    md: 15,
    lg: 20,
    xl: 28,
};

export const Divider: FC<DividerProps & { style?: ViewStyle }> = ({
    orientation = "horizontal",
    color,
    m, mv, mh, mt, mr, mb, ml,
    style,
}) => {
    const theme = useTheme();
    const dividerColor = color
        ? theme.color(color)
        : theme.componentColor("border");

    const marginStyle: ViewStyle = {};
    if (m) {
        marginStyle.margin = spacingMap[m];
    }
    if (mv) {
        marginStyle.marginTop = spacingMap[mv];
        marginStyle.marginBottom = spacingMap[mv];
    }
    if (mh) {
        marginStyle.marginLeft = spacingMap[mh];
        marginStyle.marginRight = spacingMap[mh];
    }
    if (mt) marginStyle.marginTop = spacingMap[mt];
    if (mr) marginStyle.marginRight = spacingMap[mr];
    if (mb) marginStyle.marginBottom = spacingMap[mb];
    if (ml) marginStyle.marginLeft = spacingMap[ml];

    const dividerStyle: ViewStyle =
        orientation === "vertical"
            ? { width: 1, height: "100%", backgroundColor: dividerColor }
            : { height: 1, width: "100%", backgroundColor: dividerColor };

    return <View style={[dividerStyle, marginStyle, style]} />;
};
