import { FC } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { FlexBoxProps, SpacingVariant } from "@ui";

const spacingMap: Record<SpacingVariant, number> = {
    xs: 5,
    sm: 10,
    md: 15,
    lg: 20,
    xl: 28,
};

export const FlexBox: FC<FlexBoxProps & { style?: StyleProp<ViewStyle> }> = ({
    direction,
    justifyContent,
    alignItems,
    gap,
    rowGap,
    colGap,
    style,
    children,
}) => {
    return (
        <View
            style={[
                {
                    flexDirection: direction,
                    justifyContent,
                    alignItems,
                    gap: gap ? spacingMap[gap] : undefined,
                    rowGap: rowGap ? spacingMap[rowGap] : undefined,
                    columnGap: colGap ? spacingMap[colGap] : undefined,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};
