import { FC, Children, useState } from "react";
import { Dimensions, StyleProp, View, ViewStyle } from "react-native";
import { GridProps, SpacingVariant } from "@ui";

const spacingMap: Record<SpacingVariant, number> = {
    xs: 5,
    sm: 10,
    md: 15,
    lg: 20,
    xl: 28,
};

export const Grid: FC<GridProps & { style?: StyleProp<ViewStyle> }> = ({
    cols,
    justifyContent,
    alignItems,
    gap,
    rowGap,
    colGap,
    style,
    children,
}) => {
    const [width, setWidth] = useState(Dimensions.get('window').width);
    const colCount = cols?.startsWith('equal-')
        ? parseInt(cols.split('-')[1], 10)
        : null;

    return (
        <View
            style={[
                {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent,
                    alignItems,
                    gap: gap ? spacingMap[gap] : undefined,
                    rowGap: rowGap ? spacingMap[rowGap] : undefined,
                    columnGap: colGap ? spacingMap[colGap] : undefined,
                },
                style,
            ]}
            onLayout={(e) => {
                if (!colCount) {
                    return;
                }
                setWidth(e.nativeEvent.layout.width);
            }}
        >
            {colCount ? Children.toArray(children).map((child, i) => (
                <View
                    key={i}
                    style={{
                        width: Math.round(
                            width / colCount -
                            ((colGap ? spacingMap[colGap] : gap ? spacingMap[gap] : 0) * (colCount - 1))
                        ),
                    }}
                >
                    {child}
                </View>
            )) : children}
        </View>
    );
};
