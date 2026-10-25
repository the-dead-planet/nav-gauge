import { FC } from "react";
import {
    View,
    StyleSheet,
    StyleProp,
    ViewStyle,
    type ViewInstance,
} from "react-native";
import { FlexBoxProps, resolveLayoutSpacing } from "@ui";

const directionStyles = StyleSheet.create({
    row: { flexDirection: "row" },
    column: { flexDirection: "column" },
    "row-reverse": { flexDirection: "row-reverse" },
    "column-reverse": { flexDirection: "column-reverse" },
});

export const FlexBox: FC<
    FlexBoxProps & {
        ref?: React.Ref<ViewInstance>;
        style?: StyleProp<ViewStyle>;
    }
> = ({
    ref,
    direction = "row",
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
            ref={ref}
            style={[
                directionStyles[direction],
                {
                    justifyContent,
                    alignItems,
                    gap: resolveLayoutSpacing(gap),
                    rowGap: resolveLayoutSpacing(rowGap),
                    columnGap: resolveLayoutSpacing(colGap),
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};
